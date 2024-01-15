from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

db_config = {
    "host": "changsoft1.iptime.org",
    "port": 18800,
    "user": "changsoft",
    "password": "chang2008!",
    "database": "structure3",
}


Base = declarative_base()

# 창소프트 DB(structure3)에 연결
def create_db_connection():
    db_name = db_config["database"]
    db_url = f"mysql+pymysql://{db_config['user']}:{db_config['password']}@{db_config['host']}:{db_config['port']}/{db_config['database']}"
    engine = create_engine(db_url)

    try:
        connection = engine.connect()
        if connection:
          print(f"Successfully connected to database {db_name}")
          return engine
        else:
          print("Failed to create connection")
          exit()
    except Exception as e:
        print(f"An error occurred when trying to connect to database {db_name}: {str(e)}")
        exit()

engine = create_db_connection()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Database:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            # 인스턴스가 아직 생성되지 않았다면 새로운 인스턴스를 생성
            cls._instance = super(Database, cls).__new__(cls)
            # 여기서 데이터베이스 초기화 작업을 수행할 수 있음
            Base.metadata.create_all(bind=engine)
        # 이미 생성된 인스턴스 또는 새로 생성된 인스턴스 반환
        return cls._instance

    def get_db(self):
        # 데이터베이스 세션 생성
        db = SessionLocal()
        try:
            yield db
        finally:
            db.close()
