from functools import wraps
from fastapi import HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy.exc import OperationalError, IntegrityError, TimeoutError, InvalidRequestError, DataError, StatementError
from loggingHandler import add_log
from fastapi.routing import APIRoute


def exception_handler(f):
    @wraps(f)
    async def wrapper(*args, **kwargs):
        try:
            result = await f(*args, **kwargs)
            token = kwargs['token']['id']
            print(token)
            add_log(200,token, "Successful operation")  # Log for successful operation
            return result
        except HTTPException as e:
            add_log(e.status_code, token,f"HTTPException: {e.detail}")  # Log exception
            return JSONResponse(status_code=e.status_code, content={"detail": e.detail})
        except OperationalError:
            add_log(500,token, "Operational error in database")  # Log exception
            return JSONResponse(status_code=500, content={"detail": "Operational error in database"})
        except IntegrityError:
            add_log(400,token, "Data integrity error")  # Log exception
            return JSONResponse(status_code=400, content={"detail": "Data integrity error"})
        except TimeoutError:
            add_log(408,token, "Database request timed out")  # Log exception
            return JSONResponse(status_code=408, content={"detail": "Database request timed out"})
        except InvalidRequestError:
            add_log(400, token,"Invalid request","user_name_here")  # Log exception
            return JSONResponse(status_code=400, content={"detail": "Invalid request"})
        except DataError:
            add_log(400,token, "Data error")  # Log exception
            return JSONResponse(status_code=400, content={"detail": "Data error"})
        except StatementError:
            add_log(400,token, "SQL statement error")  # Log exception
            return JSONResponse(status_code=400, content={"detail": "SQL statement error"})
        except Exception as e:
            add_log(500,token, str(e))  # Log general exceptions
            return JSONResponse(status_code=500, content={"detail": "Internal Server Error"})
    return wrapper
