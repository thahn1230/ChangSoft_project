
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

# 이거안돼서, 엔드포인트마다 @exception_handler 이거를, @router.get바로 아래줄에 다 추가해줘야됨
# 이게 되면 다 추가안하고 그냥 그대로 냅두면됨
for route in app.routes:
    route.endpoint = exception_handler(route.endpoint)

middleware_logger = logging.getLogger('middleware_logger')
middleware_logger.setLevel(logging.INFO)
file_handler = logging.FileHandler('middleware_performance.log')
file_handler.setFormatter(logging.Formatter('%(asctime)s - %(levelname)s - %(message)s'))
middleware_logger.addHandler(file_handler)
middleware_logger.propagate = False  # Prevent logs from being propagated to the root logger

@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = datetime.now()
    
    # Process request
    response = await call_next(request)
    
    # Calculate process time
    process_time = datetime.now() - start_time
    process_time_ms = process_time.total_seconds() * 1000  # Convert process time to milliseconds
    
    endpoint_path = request.url.path

    middleware_logger.info(f"Endpoint: {endpoint_path} | Processing time: {process_time_ms} ms")

    # Add X-Process-Time header to response
    response.headers["X-Process-Time"] = str(process_time_ms)
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
