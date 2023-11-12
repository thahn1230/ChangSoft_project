import logging
import json
import os
import tempfile
import shutil
from datetime import datetime, timedelta

middleware_logger = logging.getLogger('middleware_logger')
access_logger = logging.getLogger('access_logger')

stats_file ='endpoint_stats.json'

def setup_logger():
    # formatter = logging.Formatter("%(asctime)s [%(levelname)s] [User: %(username)s] %(message)s")

    # file_handler.setLevel(logging.INFO)
    # file_handler.setFormatter(formatter)

    # stream_handler = logging.StreamHandler()
    # stream_handler.setLevel(logging.INFO)
    # stream_handler.setFormatter(formatter)

    # logger = logging.getLogger()
    # logger.setLevel(logging.INFO)
    # logger.addHandler(file_handler)
    # logger.addHandler(stream_handler)

    access_logger.setLevel(logging.INFO)
    file_handler = logging.FileHandler('access.log')
    file_handler.setFormatter(logging.Formatter("%(asctime)s [%(levelname)s] [User: %(username)s] %(message)s"))
    access_logger.addHandler(file_handler)
    access_logger.propagate = False 


    middleware_logger.setLevel(logging.INFO)
    file_handler = logging.FileHandler('middleware_performance.log')
    file_handler.setFormatter(logging.Formatter('%(asctime)s - %(levelname)s - %(message)s'))
    middleware_logger.addHandler(file_handler)
    middleware_logger.propagate = False 

def read_stats():
    if os.path.exists(stats_file):
        with open(stats_file, 'r') as file:
            return json.load(file)
    else:
        return {}

# Function to write stats to file
def write_stats(stats):
    # Convert the stats dictionary into a serializable format
    serializable_stats = {}
    for endpoint, (avg_time, count) in stats.items():
        # Convert timedelta to seconds (or any other format you choose)
        if isinstance(avg_time, timedelta):
            avg_time = avg_time.total_seconds() * 1000  # Convert to milliseconds
        serializable_stats[endpoint] = [avg_time, count]

    # Write to a temporary file and then move it to the desired location
    with tempfile.NamedTemporaryFile('w', delete=False) as tf:
        json.dump(serializable_stats, tf, indent=4)
        tempname = tf.name
    shutil.move(tempname, stats_file)

def add_performance_log(performance_log):
    if middleware_logger == None:
        return
    middleware_logger.info(performance_log)

def add_log(error_code, user, message):
    is_error = error_code >= 400

    if is_error:
        access_logger.error(message, extra={'username': user})
    else:
        access_logger.info(message, extra={'username': user})