import os
from datetime import datetime, timedelta
from typing import  Dict, Any, Optional
from fastapi import Depends, Header, HTTPException
from jose import jwt
from jose.exceptions import JWTError
from passlib.context import CryptContext
from dotenv import load_dotenv
load_dotenv()
SECRET_KEY = os.getenv("secret_key","your_default_secret_key")
ALGORITHM = "HS256"
Access_Token_Expire = 60

pwd_context = CryptContext(schemes=["bcrypt"],deprecated = "auto")
comapnyInfo = Dict[str,str]

def create_access_token(data:dict,expires_delta:Optional[timedelta]=None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=Access_Token_Expire)
    to_encode.update({"exp":expire})
    encode_jwt = jwt.encode(to_encode,SECRET_KEY,algorithm=ALGORITHM)
    return encode_jwt

def verify_password(plain_password:str,hashed_password:str)->bool:
    return pwd_context.verify(plain_password,hashed_password)

def get_password_hash(password:str):
    return pwd_context.hash(password)

def get_current_user(authorization: Optional[str] = Header(None))-> comapnyInfo:
    if not authorization or not authorization.startswith("Bearer"):
        raise HTTPException(status_code =401, detail ="인증 실패 : 토큰 누락이 되었거나 인증이 실패되었습니다.")
    
    token = authorization.split(" ")[1]
    try:
        payload = jwt.decode(token,SECRET_KEY,algorithms=[ALGORITHM])
        user = payload.get("id")
        company_name = payload.get("company_name")

        if not user or not company_name :
            raise HTTPException(status_code=401,detail="인증 오류 : 토큰에 필수 정보가 없습니다.")
        return {"id":user,"company_name":company_name}
    except JWTError:
        raise HTTPException(status_code=401,detail="인증 오류 : 토큰이 유효하지 않거나 만료되었습니다.")
