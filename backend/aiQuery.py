from fastapi import APIRouter
from fastapi.responses import JSONResponse
import pandas as pd
import json

from sqlalchemy import text
from dbAccess import create_db_connection

router = APIRouter()
engine = create_db_connection()