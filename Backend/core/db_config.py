# Backend/core/db_config.py
# ------------------------------------------------------------
# SeShat - Async Database Configuration (MySQL + SQLAlchemy)
# ------------------------------------------------------------
# 1. 환경변수 기반 DB 설정 로드
# 2. 비동기 SQLAlchemy 엔진 생성 (aiomysql)
# 3. 세션 팩토리 및 FastAPI 의존성 함수 제공
# ------------------------------------------------------------

from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import (
    AsyncEngine, AsyncSession, create_async_engine
)
from sqlalchemy.orm import sessionmaker
from sqlalchemy.engine import URL
from core.config import get_settings

# ------------------------------------------------------------
# 1) 환경 설정 로드
# ------------------------------------------------------------
settings, _ = get_settings()

# SQLAlchemy URL 객체로 구성 (보다 안전하고 유지보수 용이)
DATABASE_URL = URL.create(
    drivername="mysql+aiomysql",
    username=settings.DB_USER,
    password=settings.DB_PW,
    host=settings.DB_HOST,
    port=int(settings.DB_PORT),
    database=settings.DB_DATABASE,
)

# ------------------------------------------------------------
# 2) 비동기 엔진 생성
# ------------------------------------------------------------
engine: AsyncEngine = create_async_engine(
    DATABASE_URL,
    echo=False,              # True면 SQL 로그 출력 (디버그용)
    pool_pre_ping=True,      # 커넥션 유효성 검사
    pool_recycle=1800,       # 30분마다 커넥션 재활용 (MySQL timeout 대비)
    pool_size=5,             # 기본 풀 크기
    max_overflow=10,         # 최대 초과 연결 수
    future=True,             # SQLAlchemy 2.x 호환 모드
)

# ------------------------------------------------------------
# 3) 세션 팩토리 정의
# ------------------------------------------------------------
async_session_factory = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

# ------------------------------------------------------------
# 4) FastAPI 의존성 주입 함수
# ------------------------------------------------------------
async def get_session() -> AsyncGenerator[AsyncSession, None]:
    """
    FastAPI 의존성으로 사용할 비동기 세션 생성기.
    요청마다 독립된 트랜잭션 세션을 생성하고, 자동으로 닫음.
    """
    async with async_session_factory() as session:
        try:
            yield session
        finally:
            await session.close()

# ------------------------------------------------------------
# 5) (선택) DB 연결 테스트 유틸리티
# ------------------------------------------------------------
async def test_connection() -> bool:
    """DB 연결이 정상 동작하는지 간단히 확인"""
    try:
        async with engine.begin() as conn:
            await conn.execute("SELECT 1")
        print("[DB] Connection test: OK")
        return True
    except Exception as e:
        print(f"[DB] Connection test failed: {e}")
        return False
