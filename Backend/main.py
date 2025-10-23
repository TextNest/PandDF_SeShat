from fastapi import FastAPI,Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from api import chat,login,admin,superadmin


# CORS 설정
origins = [
    "http://localhost:3000",  
    "http://127.0.0.1:3000", 

]


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,      
    allow_credentials=True,   
    allow_methods=["*"],       
    allow_headers=["*"],       
)
# app.mount("/static/images", StaticFiles(directory="page_images"), name="static_images")
templates = Jinja2Templates(directory="templates")

@app.get("/",response_class=HTMLResponse) # 리액트 연결 후 수정 예정 현재는 MVP를 위해서 임시로 작성 이후 router-> api로 풀더 이름 변경
async def main_page(request:Request):
    return templates.TemplateResponse("main.html",{"request":request})

@app.get("/login",response_class=HTMLResponse) # 리액트 연결 후 수정 예정 현재는 MVP를 위해서 임시로 작성 이후 router-> api로 풀더 이름 변경
async def main_page(request:Request):
    return templates.TemplateResponse("login.html",{"request":request})

@app.get("/register",response_class=HTMLResponse) # 리액트 연결 후 수정 예정 현재는 MVP를 위해서 임시로 작성 이후 router-> api로 풀더 이름 변경
async def main_page(request:Request):
    return templates.TemplateResponse("register.html",{"request":request})
@app.get("/chat/{pid}",response_class=HTMLResponse) # 리액트 연결 후 수정 예정 현재는 MVP를 위해서 임시로 작성 이후 router-> api로 풀더 이름 변경
async def main_page(request:Request,pid:str):
    return templates.TemplateResponse("chat.html",{"request":request,"pid":pid})

app.include_router(chat.router, tags=["chat"])
app.include_router(login.router, tags=["login"],prefix="/api")
            


