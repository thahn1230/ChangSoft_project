from ..database import Database
from sqlalchemy.orm import Session
from sqlalchemy import text

import pandas as pd

engine = Database().get_engine()

def get_user_df(id: str):
    query = f"""
    SELECT *
    FROM user_information
    WHERE id = "%(id)s"
    """

    params = {'id': id}
    user_df = pd.read_sql(query, engine, params=params)

    return user_df

def change_user_information(params:dict):
    try :
        with Session(engine) as session:
            session.execute(
                text(
                    """
                    UPDATE `user_information` SET `name` = :name, 
                    `job_position` = :job_position, `company` = :company,
                    `email_address` = :email_address, 
                    `phone_number` = :phone_number,
                    `user_type` = :user_type
                    WHERE (`id` = :user_id)
                """
                ),
                {
                    "user_id": params["user_id"],
                    "name": params["name"], 
                    "job_position": params["job_position"], 
                    "company": params["company"], 
                    "email_address": params["email_address"], 
                    "phone_number": params["phone_number"], 
                    "user_type": params["user_type"],
                }
            )

            session.commit()
    except Exception as e:
        print("An error occurred: ", e)
        session.rollback()
        return False

    return True

def get_password_df(id: str):
    query = """
        SELECT password FROM user_information
        WHERE id = %s
    """

    params = (id, )
    password_df = pd.read_sql(query, engine, params=params)
    return password_df

def change_user_password(id: str, pw: str):
    try :
        with Session(engine) as session:
            session.execute(
                text(
                    """
                    UPDATE `user_information` SET `password` = :password
                    WHERE (`id` = :user_id)
                """
                ),
                {
                    "user_id": id,
                    "password": pw, 
                }
            )

            session.commit()
    except Exception as e:
        print("An error occurred: ", e)
        session.rollback()
        return False
    
    return True

def get_login_df(id: str, pw: str):
    query=f"""
        SELECT id, name, job_position, company, email_address, phone_number, user_type
        FROM structure3.user_information
        WHERE id = "%(id)s" AND password = "%(password)s"
    """

    params = {
        'id': id,
        'password': pw
    }

    login_df = pd.read_sql(query, engine, params=params)

    return login_df

def user_sign_up(params: dict):
    try:
        with Session(engine) as session:
            session.execute(
                text(
                    """
                    INSERT INTO user_information VALUES (:user_id, :password, :name, 
                    :job_position, :company, :email_address, :phone_number, :user_type);
                """
                ),
                {"user_id": params["user_id"], "password": params["password"], "name": params["name"], "job_position": params["job_position"], 
                "company": params["company"], "email_address": params["email_address"], "phone_number": params["phone_number"], 
                "user_type": params["user_type"]}
            )

            session.commit()
    except Exception as e:
        print("An error occured: ", e)
        session.rollback()
        return False
    
    return True

def check_user_id_validity(id: str):
    query = """
        SELECT COUNT(*) as count
        FROM structure3.user_information
        WHERE id = %s
    """

    params = (id,)

    count = pd.read_sql(query, engine, params=params)

    return count