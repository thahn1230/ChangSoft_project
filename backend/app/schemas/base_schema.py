from pydantic import BaseModel

class ResponseModel(BaseModel):
    class Config:
        orm_mode=True