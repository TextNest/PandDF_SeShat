# Backend/main.py
# ------------------------------------------------------------
# SeShat - FastAPI Application Entry
# ------------------------------------------------------------
# 앱 초기화, 라우터 연결, 템플릿/정적파일 설정, CORS 허용 범위 설정.
# - 개발 단계에서는 모든 origin 허용
# - 배포 단계에서는 환경변수에서 도메인을 읽어 제한
# ------------------------------------------------------------

from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from pathlib import Path
import uvicorn

# ------------------------------------------------------------
# 1) 프로젝트 경로 설정
# ------------------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent
TEMPLATE_DIR = BASE_DIR / "templates"
STATIC_DIR = BASE_DIR / "static"  # 정적 파일 폴더 (예: CSS, JS, 이미지)

# ------------------------------------------------------------
# 2) FastAPI 앱 초기화
# ------------------------------------------------------------
app = FastAPI(title="SeShat - RAG Chatbot Engine")

# ------------------------------------------------------------
# 3) 정적 파일 / 템플릿 설정
# ------------------------------------------------------------
if not STATIC_DIR.exists():
    STATIC_DIR.mkdir(parents=True, exist_ok=True)

app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")
templates = Jinja2Templates(directory=str(TEMPLATE_DIR))

# ------------------------------------------------------------
# 4) CORS 설정
# ------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # TODO: 배포 시 환경변수로 제한
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------------------------------------------
# 5) 라우터 등록
# ------------------------------------------------------------
from api import chat, login, admin, superadmin

app.include_router(chat.router)
app.include_router(login.router)
app.include_router(admin.router)
app.include_router(superadmin.router)

# ------------------------------------------------------------
# 6) 템플릿 라우팅 (메인/로그인/회원가입/채팅)
# ------------------------------------------------------------
@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    """메인 페이지"""
    return templates.TemplateResponse("main.html", {"request": request, "page": "home"})

@app.get("/chat", response_class=HTMLResponse)
async def chat_page(request: Request):
    """채팅 페이지"""
    return templates.TemplateResponse("chat.html", {"request": request, "page": "chat"})

@app.get("/login", response_class=HTMLResponse)
async def login_page(request: Request):
    """로그인 페이지"""
    return templates.TemplateResponse("login.html", {"request": request, "page": "login"})

@app.get("/register", response_class=HTMLResponse)
async def register_page(request: Request):
    """회원가입 페이지"""
    return templates.TemplateResponse("register.html", {"request": request, "page": "register"})

# ------------------------------------------------------------
# 7) 실행 진입점
# ------------------------------------------------------------
if __name__ == "__main__":
    # Backend 디렉터리 기준 실행에도 깨지지 않도록 app import 경로를 절대경로로 지정
    uvicorn.run(
        "Backend.main:app",  # 패키지 경로 지정
        host="0.0.0.0",
        port=8000,
        reload=True
    )
