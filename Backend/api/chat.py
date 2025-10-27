# Backend/api/chat.py
# ------------------------------------------------------------
# SeShat - WebSocket Chat Endpoint
# ------------------------------------------------------------
# 실시간 사용자 메시지를 수신하여 LangGraph 기반 RAG 에이전트로 전달.
# - /ws/{pid}: PDF Project ID별 대화 세션 구분
# - JSON 통신 구조: {"type": "user"|"bot"|"system", "content": "..."}
# ------------------------------------------------------------

from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from module.chat_agent import ChatBotAgent
import json
import traceback

router = APIRouter()

@router.websocket("/ws/{pid}")
async def websocket_endpoint(websocket: WebSocket, pid: str):
    """
    WebSocket 연결 핸들러
    - pid: 문서/프로젝트 ID (벡터 인덱스 구분용)
    - 클라이언트에서 JSON 메시지를 {"type": "user", "content": "..."} 형태로 송신
    - 서버는 {"type": "bot", "content": "..."} 형태로 응답
    """
    await websocket.accept()
    print(f"[WebSocket] Client connected: pid={pid}")

    # LangGraph 기반 챗봇 에이전트 초기화
    agent = ChatBotAgent(thread_id=pid)

    try:
        while True:
            # 1) 메시지 수신
            data = await websocket.receive_text()
            try:
                payload = json.loads(data)
            except json.JSONDecodeError:
                await websocket.send_json({"type": "error", "content": "Invalid JSON format."})
                continue

            msg_type = payload.get("type")
            content = payload.get("content", "").strip()

            # 2) 사용자 메시지 처리
            if msg_type == "user" and content:
                try:
                    answer = await agent.chat(content)
                    await websocket.send_json({"type": "bot", "content": answer})
                except Exception as e:
                    err_msg = f"[Agent Error] {str(e)}"
                    traceback.print_exc()
                    await websocket.send_json({"type": "error", "content": err_msg})

            # 3) 핑/테스트 메시지 (optional)
            elif msg_type == "ping":
                await websocket.send_json({"type": "pong", "content": "alive"})
            else:
                await websocket.send_json({"type": "error", "content": "Unknown message type."})

    except WebSocketDisconnect:
        print(f"[WebSocket] Client disconnected: pid={pid}")
    except Exception as e:
        print(f"[WebSocket] Unexpected error: {e}")
        traceback.print_exc()
    finally:
        await websocket.close()
