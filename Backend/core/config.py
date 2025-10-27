# Backend/core/config.py
# ------------------------------------------------------------
# SeShat - Configuration Loader
# 프로젝트 전역에서 사용하는 경로 상수(PathConfig)와
# 환경 변수 기반 실행 설정(Settings)을 일관되게 제공한다.
#
# 설계 원칙
# 1) 부수효과 없음: import 시 시스템 환경변수를 재설정하지 않는다.
# 2) 명확한 검증: 필수 키가 없으면 즉시 예외를 던져 빠르게 실패한다.
# 3) 역할 분리: 경로 상수(PathConfig)와 런타임 설정(Settings)을 분리한다.
# ------------------------------------------------------------

from dataclasses import dataclass
from pathlib import Path
import os
from typing import Tuple, Optional
from dotenv import load_dotenv


# ------------------------------------------------------------
# 1) 경로 상수: 데이터/인덱스/이미지 등 로컬 경로 모음
# ------------------------------------------------------------
@dataclass(frozen=True)
class PathConfig:
    BASE_DIR: Path = Path(__file__).resolve().parents[1]  # .../Backend/ 기준 상위
    DATA_DIR: Path = BASE_DIR / "data"

    PDF_SOURCE_DIR = DATA_DIR / "pdf_source"
    PDF_PROCESSED_DIR = DATA_DIR / "pdf_processed"
    CHUNK_STORE_DIR = DATA_DIR / "chunk_store"
    FAISS_INDEX_DIR = DATA_DIR / "faiss_index"
    IMAGE_STORE_DIR = DATA_DIR / "image_store"
    LOGS_DIR = DATA_DIR / "logs"

    OCR_TEXTS_DIR = DATA_DIR / "ocr_texts"            # OCR 결과(JSON)
    OCR_TEXTS_CLEANED_DIR = DATA_DIR / "ocr_texts_cleaned"  # 정제 결과


    def ensure_exists(self) -> None:
        """필요한 디렉터리가 없으면 생성한다. (파일 경로는 생성하지 않음)"""
        for p in [
            self.DATA_DIR,
            self.PDF_SOURCE_DIR,
            self.PDF_PROCESSED_DIR,
            self.CHUNK_STORE_DIR,
            self.FAISS_INDEX_DIR,
            self.IMAGE_STORE_DIR,
            self.LOGS_DIR,
        ]:
            Path(p).mkdir(parents=True, exist_ok=True)


# ------------------------------------------------------------
# 2) 실행 설정: .env + OS 환경변수에서 안전하게 읽기
# ------------------------------------------------------------
@dataclass(frozen=True)
class Settings:
    # LLM/임베딩 키
    OPENAI_API_KEY: str

    # DB 접속 정보 (Async MySQL)
    DB_HOST: str
    DB_USER: str
    DB_PW: str
    DB_DATABASE: str
    DB_PORT: str  # 문자열로 두되, URL 구성 시 그대로 사용

    # JWT 시크릿/알고리즘/만료(분)
    JWT_SECRET_KEY: str
    JWT_ALG: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60


def _require(name: str, value: Optional[str]) -> str:
    """필수 환경변수를 검증하고, 누락 시 명확한 에러를 발생시킨다."""
    if value is None or value.strip() == "":
        raise RuntimeError(f"[config] Required environment variable '{name}' is missing.")
    return value


def get_settings() -> Tuple[Settings, PathConfig]:
    """
    .env를 로드하고, OS 환경변수에서 값을 읽어 Settings/PathConfig를 반환한다.
    - 부수효과(환경변수 재설정) 없음
    - 필수 키 누락 시 즉시 RuntimeError 발생
    """
    load_dotenv()  # .env가 있으면 로드

    # 표준 키 이름만 사용한다.
    openai_key = _require("OPENAI_API_KEY", os.getenv("OPENAI_API_KEY"))

    db_host = _require("DB_HOST", os.getenv("DB_HOST"))
    db_user = _require("DB_USER", os.getenv("DB_USER"))
    db_pw = _require("DB_PW", os.getenv("DB_PW"))
    db_database = _require("DB_DATABASE", os.getenv("DB_DATABASE"))
    db_port = _require("DB_PORT", os.getenv("DB_PORT"))

    jwt_secret = _require("secret_key", os.getenv("secret_key"))  # 기존 코드와 호환

    settings = Settings(
        OPENAI_API_KEY=openai_key,
        DB_HOST=db_host,
        DB_USER=db_user,
        DB_PW=db_pw,
        DB_DATABASE=db_database,
        DB_PORT=db_port,
        JWT_SECRET_KEY=jwt_secret,
    )

    paths = PathConfig()
    # 필요 시 디렉터리 생성 (선택)
    paths.ensure_exists()

    return settings, paths


# ------------------------------------------------------------
# 3) 호환 레이어: 기존 코드가 사용하던 심플 네임스페이스
#    - 기존 import 경로(core.config import path, load) 보존을 위해 제공
#    - 신규 코드는 get_settings()/PathConfig 사용을 권장
# ------------------------------------------------------------
class path:
    """기존 코드 호환용: 경로 상수만 제공"""
    FAISS_INDEX_PATH = "data/faiss_index"
    DOCSTORE_PATH = "data/docstore.pkl"
    IMAGE_STORE_PATH = "data/image_store.pkl"
    PAGE_IMAGES_DIR = "data/page_images"


class load:
    """기존 코드 호환용: DB env 튜플만 반환"""
    @staticmethod
    def envs():
        _, _paths = get_settings()
        s, _ = get_settings()
        return s.DB_HOST, s.DB_USER, s.DB_PW, s.DB_DATABASE, s.DB_PORT
