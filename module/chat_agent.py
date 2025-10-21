
from typing import Literal
from langgraph.graph import StateGraph, MessagesState, START, END
from langgraph.checkpoint.memory import MemorySaver
from langgraph.prebuilt import ToolNode
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_core.tools import tool
from module.qa_service import HybridRAGChain
import os
from dotenv import load_dotenv

load_dotenv()
os.environ["OPENAI_API_KEY"] = os.getenv("openai")


class AgentState(MessagesState):
    product_id : str
    session_id : str
catalog = {"SDH-E18KPA":"SDH-E18KPA_SDH-CP170E1_MANUAL",
    "SIF-14SSWT":"2024년_SIF-14SSWT_W3514BL_D14BCSJ_BL2314_14JKS_MANUAL",
    "SDH-E45KPA":"SDH-PM45_MANUAL"}  ## 데이터 베이스 추가시 변경 필요
_rag_cache = {}
def get_rag_chain(product_id: str) -> HybridRAGChain:
    pdf_id = catalog.get(product_id,"")
    if product_id not in _rag_cache:
        print(f"RAG 체인 생성:[{product_id}]")
        _rag_cache[product_id] = HybridRAGChain(pdf_id)
    else:
        print(f"[{product_id}] RAG 체인 재사용")
    return _rag_cache[product_id]

@tool
def product_qa_tool(query: str, product_id:str,session_id:str) -> str:
    """
    제품의 정보 및 메뉴얼에 대한 질문에 답변합니다.
    """
    rag = get_rag_chain(product_id)
    answer = rag.invoke(query,session_id)
    return answer["answer"]


class  ChatBotAgent:
    def __init__(self,product_id:str,session_id:str):
        self.product_id = product_id
        self.llm = ChatOpenAI(model = "gpt-4o",temperature=0)
        self.tools = [product_qa_tool]
        self.checkpoint = MemorySaver()
        self.graph =self._build_graph()
        self.session_id = session_id
    
    def _build_graph(self) :
        work  = StateGraph(AgentState)
        llm_with_tools = self.llm.bind_tools(self.tools)
        def agent_node(state):
            product_id = self.product_id
            system_msg = SystemMessage("""
            당신은 '{product_id}' 제품에 대한 상담을 진행하는 전문 챗봇입니다.
            사용자가 '이거', '저거', '스펙' 등 구체적인 제품명 없이 질문하더라도, 현재 대화의 주제인 '{product_id}'에 대한 질문으로 가정하고 답변해야 합니다.

            - 일상 대화는 직접 답변합니다.
            - 제품과 관련된 질문(기능, 스펙, 사용법 등)은 반드시 'product_qa_tool'을 사용해서 답변해야 합니다.
            """)
            response = llm_with_tools.invoke([system_msg]+state["messages"])
            return {"messages":[response]}

        def tool_node(state):
            last_msg = state["messages"][-1]
            if hasattr(last_msg,"tool_calls") and last_msg.tool_calls: #마지막 메세지에 too_calls 속성이 있고 값이 있으면
                for call in last_msg.tool_calls:
                    call['args']['product_id'] = state["product_id"]
                    call['args']['session_id'] = state["session_id"]
                    print(f"도구 이름: {call['name']}")
                    print(f"전달된 인자: {call['args']}")
            return ToolNode(self.tools).invoke(state)

        def end_node(state):
            last_msg = state["messages"][-1]
            if hasattr(last_msg,"tool_calls") and last_msg.tool_calls:
                return "tools"
            return "end"
        work.add_node("agent",agent_node)
        work.add_node("tools",tool_node)
        work.add_edge(START,"agent")
        work.add_conditional_edges("agent",end_node,{"tools":"tools","end":END})
        work.add_edge("tools","agent")
        return work.compile(checkpointer=self.checkpoint)

    def chat(self,query:str):
        config = {"configurable":{"thread_id":self.session_id}}
        initial_state = {
            "messages":[HumanMessage(content=query)],
            "product_id":self.product_id,
            "session_id":self.session_id
        }
        result = self.graph.invoke(initial_state,config=config)
        final_message = result["messages"][-1]
        return {"answer":final_message.content}
