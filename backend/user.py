from fastapi import APIRouter
from fastapi.responses import JSONResponse

from fastapi import Depends, FastAPI, HTTPException 
from fastapi.security import OAuth2PasswordBearer

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import HTTPBasic, HTTPBasicCredentials

from dbAccess import create_db_connection
from sqlalchemy.orm import Session
from sqlalchemy import text

import pandas as pd
import jwt
from pydantic import BaseModel
from datetime import datetime, timedelta
from userLoginInfo import SECRET_KEY, ACCESS_TOKEN_EXPIRE_MINUTES
from userLogin import oauth2_scheme, decode_jwt_token

router = APIRouter()
engine = create_db_connection()
connection = engine.connect()

class TokenData(BaseModel):
    user_id: str
    company: str
    email_address: str

def verify_user(token: str = Depends(oauth2_scheme)) -> str: # check_user_permission
    return decode_jwt_token(token)

@router.get("/user/profile")
def get_user_info(token: TokenData = Depends(verify_user)): 
    query = f"""
    SELECT id, name, job_position, company, 
    email_address, phone_number, user_type 
    FROM user_information
    WHERE id = "{token["id"]}"
    """
    
    user_df = pd.read_sql(query, engine)
    
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
async def change_user_info(params: dict, token: TokenData = Depends(verify_user)):
    
    user_id = token["id"]
    name = params["join_info"]["name"]
    job_position = params["join_info"]["job_position"]
    company = params["join_info"]["company"]
    email_address = params["join_info"]["email_address"]
    phone_number = params["join_info"]["phone_number"]
    try :
        with Session(engine) as session:
            session.execute(
                text(
                    """
                    UPDATE `user_information` SET `name` = :name, 
                    `job_position` = :job_position, `company` = :company,
                    `email_address` = :email_address, 
                    `phone_number` = :phone_number
                    WHERE (`id` = :user_id)
                """
                ),
                {
                    "user_id": user_id,
                    "name": name, 
                    "job_position": job_position, 
                    "company": company, 
                    "email_address": email_address, 
                    "phone_number": phone_number, 
                }
            )
        
            session.commit()
    except Exception as e:
        print("An error occurred: ", e)
        session.rollback()
        return False
    
    return True

@router.post("/user/change_pw")
async def change_password(params: dict, token: TokenData = Depends(verify_user)):
    print(params)
    current_pw = ""
    changed_pw = ""
    return True