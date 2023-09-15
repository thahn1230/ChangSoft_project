import logging


def setup_logger():
    formatter = logging.Formatter("%(asctime)s [%(levelname)s] [User: %(username)s] %(message)s")

    file_handler = logging.FileHandler('application.log')
    file_handler.setLevel(logging.INFO)
    file_handler.setFormatter(formatter)

    stream_handler = logging.StreamHandler()
    stream_handler.setLevel(logging.INFO)
    stream_handler.setFormatter(formatter)

    logger = logging.getLogger()
    logger.setLevel(logging.INFO)
    logger.addHandler(file_handler)
    logger.addHandler(stream_handler)

def add_log(error_code, user, message):
    is_error = error_code >= 400

    if is_error:
        logging.error(message, extra={'username': user})
    else:
        logging.info(message, extra={'username': user})