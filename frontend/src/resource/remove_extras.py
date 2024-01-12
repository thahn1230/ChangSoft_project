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

# 예시: delete_non_png_files('/path/to/directory')
# 주의: 실제 경로로 교체하고 실행하기 전에 주의사항을 확인하세요.
