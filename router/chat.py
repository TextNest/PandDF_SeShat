from fastapi import APIRouter,WebSocket,WebSocketDisconnect,Request
from fastapi.responses import HTMLResponse
import asyncio
import random
from fastapi.templating import Jinja2Templates
from module.chat_agent import ChatBotAgent
templates = Jinja2Templates(directory="templates")


router = APIRouter()

@router.get("/chat/{pid}",response_class=HTMLResponse)
async def chat_page(request:Request,pid:str):
    return templates.TemplateResponse("chat.html",{"request":request,"pid":pid})

@router.websocket("/ws/{pid}")
async def websocket_endpoint(websocket:WebSocket,pid:str):

    await websocket.accept()
    print("연결 성공")  
    print(f"✅ 연결 성공! 전달받은 PID: {pid}")
    try:
        session_id = str(random.randint(100000,999999))
        agent = ChatBotAgent(product_id = pid,session_id = session_id)
        await websocket.send_json({"type":"bot", "message": f"{pid} 상품의 정보 입니다."})
        await asyncio.sleep(0.5)
        await websocket.send_json({"type":"bot","message":"무엇을 도와드릴까요?"})
        while True:
            data = await websocket.receive_text()
            print(f"User message: {data}")
            answer = agent.chat(data)
            print(answer)
            await websocket.send_json({"type":"bot","message":answer["answer"]})

    except WebSocketDisconnect:
        print("연결 종료")

