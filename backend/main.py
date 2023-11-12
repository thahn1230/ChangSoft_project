
from fastapi import FastAPI, Request
from fastapi.routing import APIRoute
from add_middleware import add_middleware
from dashboard import router as dashboardRouter
from project import router as projectRouter
from projectDetail import router as projectDetailRouter
from buildingDetail import router as buildingDetailRouter
from subBuildingDetail import router as subBuildingDetailRouter
from insight import router as insightRouter
from aiQuery import router as aiQueryRouter
from userLogin import router as userLoginRouter
from user import router as userRouter

from datetime import datetime
import time

import logging
from loggingHandler import setup_logger 
from loggingHandler import add_performance_log
from loggingHandler import read_stats, write_stats
import asyncio

#test
from exceptionHandler import exception_handler

from pydantic import BaseModel

# FastAPI 모듈 설정
app = FastAPI()
# origins와 CORS 설정
add_middleware(app)
# 라우터 세팅
app.include_router(dashboardRouter)
app.include_router(projectRouter)
app.include_router(projectDetailRouter)
app.include_router(buildingDetailRouter)
app.include_router(subBuildingDetailRouter)
app.include_router(insightRouter)
app.include_router(aiQueryRouter)
app.include_router(userLoginRouter)
app.include_router(userRouter)

setup_logger()

lock = asyncio.Lock()
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = datetime.now()
    
    # Process request
    response = await call_next(request)
    
    # Calculate process time
    process_time = datetime.now() - start_time
    process_time_ms = process_time.total_seconds() * 1000  # Convert process time to milliseconds
    
    endpoint_path = request.url.path

    add_performance_log(f"Endpoint: {endpoint_path} | Processing time: {process_time_ms} ms")
    # middleware_logger.info(f"Endpoint: {endpoint_path} | Processing time: {process_time_ms} ms")



    async with lock:
        stats = read_stats()
        if endpoint_path in stats:
            old_avg, old_count = stats[endpoint_path]
            new_count = old_count + 1
            new_avg = ((old_avg * old_count) + process_time_ms) / new_count
            stats[endpoint_path] = (new_avg, new_count)
        else:
            stats[endpoint_path] = (process_time_ms, 1)
        write_stats(stats)

    return response



## 테스트용
class Message(BaseModel):
    message: str
# root 읽기
@app.get("/", response_model=Message)
async def read_root(request: Request):
    if request is None:
        return {"message": "Request is None"}
    
    domain = request.headers.get("host")
    return {"message": f"Hello from {domain}"}
