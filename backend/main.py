import uvicorn

from fastapi import FastAPI
from add_middleware import add_middleware
from dashboard import router as dashboard_router
from project import router as project_router
from project_detail import router as project_detail_router
from building_detail import router as building_detail_router
from sub_building_detail import router as sub_building_detail_router
from insight import router as insight_router

# FastAPI 모듈 설정
app = FastAPI()
# origins와 CORS 설정
add_middleware(app)
# 라우터 세팅
app.include_router(dashboard_router)
app.include_router(project_router)
app.include_router(project_detail_router)
app.include_router(building_detail_router)
app.include_router(sub_building_detail_router)
app.include_router(insight_router)

# root 읽기
@app.get("/")
def read_root():
    return {"Hello": "World"}    


