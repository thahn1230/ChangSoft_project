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


class Database:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(Database, cls).__new__(cls)
            cls._instance.engine = create_db_connection()
            Base.metadata.create_all(bind=cls._instance.engine)
        return cls._instance

    def get_db(self):
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=self.engine)
        db = SessionLocal()
        try:
            yield db
        finally:
            db.close()

    def get_engine(self):
        return self.engine