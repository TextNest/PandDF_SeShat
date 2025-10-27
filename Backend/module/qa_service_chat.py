# =============================================================================
# File: Backend/module/qa_service_chat.py
# =============================================================================
# SeShat - 제품별 질의응답 콘솔 인터페이스 (RAG 기반)
# -----------------------------------------------------------------------------
# 목적:
#   - 사용자가 입력한 제품명(model_name)에 따라 해당 제품의 벡터 인덱스를 자동 로드
#   - 모델명 인덱스가 없을 경우 통합 인덱스(index.faiss)로 폴백
#   - LangChain Retriever + LLM(QA Chain) 기반 질의응답 수행
#
# 실행:
#   (venv) $ python -m Backend.module.qa_service_chat
#
# 요구 패키지:
#   pip install langchain langchain-community langchain-openai faiss-cpu tqdm
#   pip install openai
#
# 환경:
#   .env 파일에 OPENAI_API_KEY 설정 필요
# =============================================================================

from __future__ import annotations
import os
from pathlib import Path
from Backend.core.config import get_settings
from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate

# ------------------------------
# 1) RAG 체인 로더
# ------------------------------
def load_product_rag_chain(product_id: str):
    """
    제품명 기반 RAG 체인 생성
    1️⃣ 해당 제품의 인덱스가 있으면 로드
    2️⃣ 없으면 통합 인덱스(index.faiss)로 폴백
    """
    _, paths = get_settings()
    base_dir = Path(paths.DATA_DIR) / "faiss_index"
    embeddings = OpenAIEmbeddings(model="text-embedding-3-small")

    product_dir = base_dir / product_id
    fallback_index = base_dir / "documents"

    if product_dir.exists():
        index_path = product_dir / "index.faiss"
        store_dir = product_dir
        print(f"[INIT] Loading FAISS index from: {product_dir}")
    elif fallback_index.exists():
        store_dir = fallback_index
        print(f"⚠️ [{product_id}] 전용 인덱스가 없습니다. 통합 인덱스를 사용합니다.")
        print(f"[INIT] Loading FAISS index from: {fallback_index}")
    else:
        raise FileNotFoundError("❌ 사용할 수 있는 인덱스가 없습니다.")

    # FAISS 로드
    vectorstore = FAISS.load_local(
        str(store_dir),
        embeddings,
        allow_dangerous_deserialization=True
    )

    # 프롬프트 템플릿
    prompt_template = """
    당신은 {product_id} 제품의 공식 설명서를 바탕으로 사용자의 질문에 답하는 전문 AI 어시스턴트입니다.
    아래는 사용자의 질문입니다:
    ------------------------
    {context}
    ------------------------
    질문: {question}
    답변은 반드시 한국어로, 친절하고 간결하게 작성하세요.
    """
    prompt = PromptTemplate(
        template=prompt_template,
        input_variables=["context", "question", "product_id"]
    )

    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.2)
    retriever = vectorstore.as_retriever(search_kwargs={"k": 5})

    chain = RetrievalQA.from_chain_type(
        llm=llm,
        retriever=retriever,
        chain_type="stuff",
        chain_type_kwargs={"prompt": prompt.partial(product_id=product_id)}
    )

    return chain


# ------------------------------
# 2) 콘솔 인터랙티브 챗
# ------------------------------
def interactive_chat():
    print("\n📘 SeShat - 제품별 AI 매뉴얼 어시스턴트")
    print("────────────────────────────────────────────")
    product_id = input("모델명을 입력하세요 (예: SVC-ST25WIF_USER): ").strip()

    try:
        chain = load_product_rag_chain(product_id)
    except FileNotFoundError as e:
        print(f"❌ 인덱스를 불러올 수 없습니다. ({e})")
        return

    print(f"\n✅ [{product_id}] 인덱스 로드 완료. 이제 질문을 입력하세요.")
    print("종료하려면 'exit' 또는 'quit' 입력.\n")

    while True:
        question = input("❓ 질문: ").strip()
        if question.lower() in ["exit", "quit"]:
            print("👋 종료합니다. 다음에 또 만나요!")
            break

        try:
            result = chain({"query": question})
            answer = result.get("result", "").strip()
            sources = result.get("source_documents", [])

            print(f"\n💬 AI: {answer}\n────────────────────────────────────────────")

            # 근거 문서 표시
            if sources:
                print("📚 [REFERENCE DOCS]")
                for i, doc in enumerate(sources[:3], 1):
                    name = doc.metadata.get("document_id", "unknown")
                    print(f"- ({i}) {name} | {len(doc.page_content)}자")
                print("────────────────────────────────────────────\n")

        except Exception as e:
            print(f"⚠️ 오류 발생: {e}")


# ------------------------------
# 3) CLI 실행
# ------------------------------
if __name__ == "__main__":
    interactive_chat()
