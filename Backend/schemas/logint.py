from pydantic import BaseModel

class LoginRequest(BaseModel):
    username: str        # 프론트가 username으로 보낸다면 여기를 수정
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str