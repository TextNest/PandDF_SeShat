from fastapi import APIRouter,WebSocket,WebSocketDisconnect,Request
from fastapi.responses import HTMLResponse
import asyncio
import random
from fastapi.templating import Jinja2Templates
from module.chat_agent import ChatBotAgent
import time
templates = Jinja2Templates(directory="templates")


router = APIRouter()



@router.websocket("/ws/{pid}")
async def websocket_endpoint(websocket:WebSocket,pid:str):

    await websocket.accept()
    print("연결 성공")  
    try:
        session_id = str(random.randint(100000,999999))
        agent = ChatBotAgent(product_id = pid,session_id = session_id)
        await websocket.send_json({"type":"bot", "content": f"{pid} 상품의 정보 입니다."})
        await asyncio.sleep(0.5)
        await websocket.send_json({"type":"bot","content":"무엇을 도와드릴까요?"})
        while True:
            data = await websocket.receive_text()
            start = time.time()
            answer = agent.chat(data)
            end  = time.time()
            total_time = end - start 
            print(f"{total_time:0.2f}초 걸렸습니다.")
            await websocket.send_json({"type":"bot","content":answer["answer"]})

            # async for token in agent.stream_chat(data):
            #     await websocket.send_json({"type": "token", "content": token}) ## type bot:normal , type token : stream
            # await websocket.send_json({"type":"stream_end"})
    except WebSocketDisconnect:
        print("연결 종료")

