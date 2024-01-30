from fastapi import APIRouter, Depends, HTTPException 
from fastapi.security import OAuth2PasswordBearer

from sqlalchemy.orm import Session
from sqlalchemy import text

from ..crud.user_crud import *

import jwt
from pydantic import BaseModel
from userLoginInfo import SECRET_KEY, ACCESS_TOKEN_EXPIRE_MINUTES
from ..userLogin import oauth2_scheme, decode_jwt_token, sha256_hash
from exceptionHandler import exception_handler

from datetime import datetime, timedelta

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

class TokenData(BaseModel):
    user_id: str
    company: str
    email_address: str

async def verify_user(token: str = Depends(oauth2_scheme)) -> str: # check_user_permission
    return decode_jwt_token(token)

@router.get("/user/profile")
@exception_handler
async def get_user_info(token: TokenData = Depends(verify_user)): 
    user_df = get_user_df(token["id"])

    id = user_df["id"].iloc[0]
    name = user_df["name"].iloc[0]
    job_position = user_df["job_position"].iloc[0]
    company = user_df["company"].iloc[0]
    email_address = user_df["email_address"].iloc[0]
    phone_number = user_df["phone_number"].iloc[0]
    user_type = user_df["user_type"].iloc[0]

    return {"id" : id,
            "name" : name,
            "job_position" : job_position,
            "company" : company,
            "email_address" : email_address,
            "phone_number" : phone_number,
            "user_type" : user_type,
            }


@router.post("/user/change_info")
@exception_handler
async def change_user_info(params: dict, token: TokenData = Depends(verify_user)):

    user_id = token["id"]
    name = params["join_info"]["name"]
    job_position = params["join_info"]["job_position"]
    company = params["join_info"]["company"]
    email_address = params["join_info"]["email_address"]
    phone_number = params["join_info"]["phone_number"]
    user_type = params["join_info"]["user_type"]

    user_info = {
        "user_id": user_id,
        "name": name, 
        "job_position": job_position, 
        "company": company, 
        "email_address": email_address, 
        "phone_number": phone_number, 
        "user_type": user_type,
    }

    validCheck = change_user_information(user_info)

    if validCheck == True:
        return True
    else:
        return False

    

@router.post("/user/change_pw")
@exception_handler
async def change_password(params: dict, token: TokenData = Depends(verify_user)):
    user_id = token["id"]
    
    current_pw_db = get_password_df(user_id)["password"].iloc[0]
    current_pw_client = sha256_hash(params["pw_info"]["current_pw"])
    changed_pw = sha256_hash(params["pw_info"]["changed_pw"])
    
    # 파알못 팀장님 string 값비교는 == != 입니다
    # is, is not은 객체 비교라서 엄연히 달라요
    # -의문의 기홍씨-
    if current_pw_db != current_pw_client :
        # current_pw is not correct
        return False
    else :
        valid_check = change_user_password(user_id, changed_pw)
            
    
    if valid_check == True:
        return True
    else:
        return False



# User Login
# token 생성
def create_jwt_token(user_id: str) -> str:
    user_df = get_user_df(user_id)

    # JWT payload 설정
    payload = {
        "id": user_df["id"].iloc[0],
        "company": user_df["company"].iloc[0],
        "name": user_df["name"].iloc[0],
        "email_address": user_df["email_address"].iloc[0],
        "user_type": user_df["user_type"].iloc[0],
        "exp": datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    }

    # JWT 생성 및 서명
    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")

    return {"token": token, "status": True}

def decode_jwt_token(token: str) -> dict:
    try:
        # JWT 디코딩
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def read_users_me(token: str = Depends(oauth2_scheme)): 
    # JWT 디코딩하여 사용자 정보를 얻어옴
    user_info = decode_jwt_token(token)

    # 사용자를 식별하고 로그를 남길 수 있습니다.
    return {"user_id": user_info["sub"], "token": token}

# 로그인
@router.post("/login")
async def login(params: dict):

    user_id = params["login_info"]["id"]
    password = sha256_hash(params["login_info"]["password"])

    login_df = get_login_df(user_id, password)

    if login_df.empty:
        return {"token": "", "status": False}
    else :
        return create_jwt_token(user_id)

# 회원가입
@router.post("/sign_up")
async def sign_up(params: dict):
    user_id = params["join_info"]["id"]
    password = sha256_hash(params["join_info"]["password"])
    name = params["join_info"]["name"]
    job_position = params["join_info"]["job_position"]
    company = params["join_info"]["company"]
    email_address = params["join_info"]["email_address"]
    phone_number = params["join_info"]["phone_number"]
    user_type = params["join_info"]["user_type"]

    user_params = {
        "user_id": user_id,
        "password": password,
        "name": name,
        "job_position": job_position,
        "company": company,
        "email_address": email_address,
        "phone_number": phone_number,
        "user_type": user_type
    }

    valid_check = user_sign_up(user_params)
    if valid_check == True:
        return {"result": True}
    else:
        return {"result": False}


# ID 중복성 검사
@router.post("/sign_up/check_id")
async def check_id_validity(params: dict):
    user_id = params["id_info"]["id"]

    count = check_user_id_validity(user_id)

    if count["count"].iloc[0] != 0 :
        return {"result": False}
    else :
        return {"result": True}