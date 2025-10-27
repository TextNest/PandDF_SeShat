# Backend/core/auth.py
# ------------------------------------------------------------
# SeShat - Authentication & Token Utility
# ------------------------------------------------------------
# 1. 비밀번호 해시 및 검증
# 2. JWT 토큰 생성 및 검증
# 3. 환경 변수(.env) 기반 보안키 및 만료시간 관리
# ------------------------------------------------------------

from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError, ExpiredSignatureError
from passlib.context import CryptContext
from core.config import get_settings

# ------------------------------------------------------------
# 1) 설정 로드
# ------------------------------------------------------------
settings, _ = get_settings()

SECRET_KEY = settings.JWT_SECRET_KEY
ALGORITHM = settings.JWT_ALG
ACCESS_TOKEN_EXPIRE_MINUTES = settings.ACCESS_TOKEN_EXPIRE_MINUTES

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ------------------------------------------------------------
# 2) 비밀번호 유틸리티
# ------------------------------------------------------------
def verify_password(plain_password, hashed_password):
    # 개발용 임시 단순 비교
    return plain_password == hashed_password

def get_password_hash(password):
    return pwd_context.hash(password)

# ------------------------------------------------------------
# 3) JWT 생성 및 검증
# ------------------------------------------------------------
def create_access_token(data: dict) -> str:
    """JWT Access Token 생성"""
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    token = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return token

def decode_access_token(token: str) -> dict:
    """JWT 디코딩 및 검증"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except ExpiredSignatureError:
        raise JWTError("Token has expired")
    except JWTError as e:
        raise JWTError(f"Invalid token: {str(e)}")
