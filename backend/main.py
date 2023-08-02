
from fastapi import FastAPI, Request
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

# root 읽기
@app.get("/")
async def read_root(request: Request):
    if request is None:
        return {"message": "Request is None"}

    domain = request.headers.get("host")
    return {"message": f"Hello from {domain}"}


