from fastapi import APIRouter
from dbAccess import create_db_connection

router = APIRouter()
engine = create_db_connection()
connection = engine.connect()

