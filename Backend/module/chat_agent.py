# Backend/module/chat_agent.py
# ------------------------------------------------------------
# SeShat - LangGraph Chat Agent
# ------------------------------------------------------------
# 1. LangGraph 기반 상태 그래프 구성
# 2. 사용자 질의 → RAG 검색 → 응답 생성 파이프라인
# 3. 세션(thread_id) 단위 대화 메모리 관리
# ------------------------------------------------------------

from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver
from langchain.schema import HumanMessage, SystemMessage
from Backend.module.qa_service_chat import run_rag
import traceback
from typing import Dict, Any


class ChatBotAgent:
    """LangGraph 기반 RAG 챗봇 에이전트"""

    def __init__(self, thread_id: str = "default"):
        # 각 클라이언트(WebSocket 연결) 별 세션 구분
        self.thread_id = thread_id

        # 세션별 메모리 관리 (LangGraph MemorySaver)
        self.memory = MemorySaver()

        # 그래프 초기화
        self.graph = self._build_graph()

    # --------------------------------------------------------
    # 1) 그래프 정의
    # --------------------------------------------------------
    def _build_graph(self) -> StateGraph:
        """LangGraph 상태그래프 구성"""

        # (1) 노드 정의: 질문 처리 → RAG 실행
        def call_rag(state: Dict[str, Any]):
            question = state["question"]
            try:
                # run_rag은 비동기 함수로 가정 (asyncio-safe)
                answer = run_rag(question)
                return {"answer": answer}
            except Exception as e:
                traceback.print_exc()
                return {"answer": f"오류가 발생했습니다: {e}"}

        # (2) 그래프 구성
        graph = StateGraph()
        graph.add_node("RAG", call_rag)
        graph.set_entry_point("RAG")
        graph.set_finish_point("RAG")

        return graph

    # --------------------------------------------------------
    # 2) 챗 루프 실행
    # --------------------------------------------------------
    async def chat(self, question: str) -> str:
        """
        사용자 질문을 받아 LangGraph RAG 노드 실행.
        thread_id 단위로 메모리를 유지.
        """
        state = {"question": question}

        try:
            result = self.graph.invoke(
                state,
                self.memory,
                thread_id=self.thread_id
            )
            answer = result.get("answer", "")
            return answer
        except Exception as e:
            traceback.print_exc()
            return f"❌ 응답 생성 중 오류 발생: {e}"
