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
from datetime import datetime, timedelta
from userLoginInfo import SECRET_KEY, ACCESS_TOKEN_EXPIRE_MINUTES
from userLogin import oauth2_scheme, decode_jwt_token
from dashboard import TokenData

router = APIRouter()
engine = create_db_connection()
connection = engine.connect()

def verify_user(token: str = Depends(oauth2_scheme)) -> str: # check_user_permission
    return decode_jwt_token(token)

@router.get("/user/profile")
def get_user_info(token: TokenData = Depends(verify_user)): 
    return {"name" : token["name"], "email_address" : token["email_address"]}