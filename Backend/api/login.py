# Backend/api/login.py
# ------------------------------------------------------------
# SeShat - User Login API
# ------------------------------------------------------------
# 1. 사용자 로그인 요청 처리
# 2. 비밀번호 검증 후 JWT 토큰 발급
# 3. MVP 단계에서는 DB 연결 대신 fake_user로 테스트
# ------------------------------------------------------------

from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from core.db_config import get_session
from core.auth import create_access_token, verify_password
from schemas.logint import LoginRequest, TokenResponse

router = APIRouter()

@router.post("/api/login", response_model=TokenResponse)
async def login_user(
    request: LoginRequest,
    session: AsyncSession = Depends(get_session)
):
    # TODO: DB에서 실제 사용자 조회 로직 연결
    fake_user = {"username": "test_user", "password": "1234"}

    if not verify_password(request.password, fake_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # JWT 발급
    access_token = create_access_token({"sub": fake_user["username"]})

    return {"access_token": access_token, "token_type": "bearer"}
