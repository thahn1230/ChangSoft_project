app/
├── models/
│   ├── {도메인}_model.py  # 각 도메인에 맞는 요청 및 응답 모델
│
│   ├── aiQuery_model.py
│   ├── building_model.py
│   ├── insight_model.py
│   ├── project_model.py
│   ├── subBuilding_model.py
│   ├── user_model.py
│
├── routers/
│   ├── {도메인}_router.py  # 도메인별 라우팅 정의
│
│   ├── aiQuery_router.py
│   ├── building_router.py
│   ├── insight_router.py
│   ├── project_router.py
│   ├── subBuilding_router.py
│   ├── user_router.py
│
├── crud/
│   ├── {도메인}_crud.py  # 데이터베이스 접근 및 CRUD 작업
│
│   ├── building_crud.py
│   ├── insight_crud.py
│   ├── project_crud.py
│   ├── subBuilding_crud.py
│   ├── user_crud.py
│
├── internal/
│   ├── {도메인}_utils.py  # 도메인별 유틸리티 함수 및 데이터 처리
│   ├── {도메인}_services.py  # 비즈니스 로직 및 복잡한 함수
│
├── exceptions.py  # 프로젝트 전반의 예외 처리 정의
└── main.py  # 애플리케이션 진입점 및 설정


도메인을 기준으로 나누는거니까 dashboard랑 insight는 제거