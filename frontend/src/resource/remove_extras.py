import os
import glob

def delete_non_png_files(directory):
    non_png_files = glob.glob(os.path.join(directory, '**', '*'), recursive=True)
    non_png_files = [f for f in non_png_files if not f.endswith('.png') and os.path.isfile(f)]

    # 각 파일 삭제
    for file in non_png_files:
        os.remove(file)
        print(f"Deleted: {file}")

delete_non_png_files('./project_pictures')

