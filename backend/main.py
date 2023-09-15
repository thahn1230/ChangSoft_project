
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

import logging
from loggingHandler import setup_logger 

#test
from exceptionHandler import exception_handler

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

# root 읽기
@app.get("/")
async def read_root(request: Request):
    if request is None:
        return {"message": "Request is None"}

    domain = request.headers.get("host")
    return {"message": f"Hello from {domain}"}


