# ChangSoft_project

This repository is for project in ChangSoftI&amp;I

1. BackEnd 서버를 돌리려면 필요한 파일들(add_middleware.py, dbAccess.py, origins.py)을 다운 받은 후 main.py가 있는 디렉토리로 이동 후 다음 명령어를 입력합니다.(wsl 기반. 이때 wsl에서 서버를 연다면 wsl과 windows 간에 포트포워딩을 해야 할 수도 있습니다)

uvicorn main:app --reload --host 0.0.0.0 --port 8000

이때 명령어의 뜻은 다음과 같습니다.
main.py 안에 있는 app 모듈을 실행한다.
"--reload" : 자동으로 재로딩 되게한다(코드 수정하고 저장 시 자동으로 서버 리부트가 됨)
"--host 0.0.0.0" : 모든 호스트들을 접속할 수 있게 한다
"--port 8000" : 포트번호를 8000번으로 지정한다

- 이때 각자 컴퓨터에서 할당 받은 ip주소를 가지고 다른 컴퓨터에서 접속을 시도하려면 localhost에서의 방화벽을 해제시켜야 합니다

<포트포워딩 하는법>

1. 윈도우 또는 WSL 재부팅시
   // powershell 관리자 권한으로 실행 후
   netsh interface portproxy reset

2. 기존 세팅 삭제
   netsh interface portproxy delete v4tov4 listenport=8000 listenaddress=0.0.0.0
   -> "지정된 파일을 찾을 수 없습니다" 떠도 괜찮습니다.

3. 새로 포트포워딩 설정
   netsh interface portproxy add v4tov4 listenport=8000 listenaddress=0.0.0.0 connectport=8000 connectaddress=????
   -> ????부분은 WSL 안에서 ifconfig으로 나온 ipv4주소를 입력
