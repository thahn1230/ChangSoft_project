from typing import Tuple
from pydantic import BaseModel

class LatLngWithSum(BaseModel):  # BaseModel을 상속받아 정의
    latlng: Tuple[float, float]  # latlng 필드 타입을 Tuple로 변경
    sum: int
