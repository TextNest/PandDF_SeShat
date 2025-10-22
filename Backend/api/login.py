from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text 
from typing import Dict, Any, List

# core/dependencies.py에서 필요한 의존성 및 함수 임포트
from core.auth import create_access_token,verify_password,get_password_hash,get_current_user
from core.db_config import get_session

router = APIRouter()
class LoginRequest(BaseModel):
    user_id: str
    pw: str

class Register(BaseModel):
    company_name:str
    name:str
    user_id:str
    department:str
    preferred_language:str
    pw:str
class FindCode(BaseModel):
    company_code:str

find_company= """
SELECT company_name 
FROM company
WHERE company_code = :code
"""
regist_query = """
INSERT INTO users (user_id ,pw_hash,company_name,department,preferred_language)VALUES (:user_id ,:pw_hash,:company_name,:department,:preferred_language)
"""
@router.post("/register/code")
async def regist_with_code(code:FindCode,session:AsyncSession=Depends(get_session)):
    result = await session.execute(text(find_company),
    params={"code":code.company_code})
    code_row = result.mappings().one_or_none
    if not code_row:
        raise HTTPException(status_code=401,detail="현재 등록된 코드가 없습니다.")
    return {"company_name":code_row["company_name"]}
@router.post("/register/info")
async def regist_with_hash_pw(write_info:Register,session:AsyncSession=Depends(get_session)):
    pw_hash = get_password_hash(write_info.pw)
    params = {
        "company_name":write_info.company_name,
        "user_id":write_info.user_id,
        "department":write_info.department,
        "preferred_language":write_info.preferred_language,
        "pw_hash":pw_hash
    }
    try:
        await session.execute(text(regist_query),params=params)
        session.commit()
        return {"message":f"{write_info.user_id}가 등록되었습니다."}
    except Exception as e:
        await session.rollback()
        raise HTTPException(status_code=400,detail=f"사용자 등록 실패했습니다.(오류:{e})")

login_query = """
SELECT company_id,pw_hash
FROM users
WHERE user_id = :user_id
"""

@router.post("/login")
async def login_with_token(login_data:LoginRequest,session:AsyncSession=Depends(get_session)):
    result = await session.execute(text(login_query),params={"user_id":login_data.user_id})
    user_row = result.mappings().one_or_none
    if not user_row:
        raise HTTPException(status_code=401,detail="아이디를 찾을 수 없습니다.")
    
    if not verify_password(login_data.pw,user_row["pw_hash"]):
        raise HTTPException(status_code=401,detail="비밀번호가 일치하지 않습니다.")
    
    from time import timedelta
    access_token = create_access_token(
        data ={
            "id":login_data.user_id,
            "company_name":user_row["company_name"]
        } # expire 미 작성시 30분  작성법  expires_delta = timedelta(days=1)
    )
    return {
        "access_token":access_token,
        "token_type":"Bearer"
    }

