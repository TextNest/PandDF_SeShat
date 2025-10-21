from fastapi import FastAPI,Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from router import chat


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

@app.get("/",response_class=HTMLResponse)
async def main_page(request:Request):
    return templates.TemplateResponse("main.html",{"request":request})

app.include_router(chat.router, tags=["chat"])
            
            


