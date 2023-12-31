# ChangSoft_project

This repository is for project in ChangSoftI&amp;I

---

BackEnd 서버를 돌리려면 필요한 파일들(add_middleware.py, dbAccess.py, origins.py)을 다운 받은 후 main.py가 있는 디렉토리로 이동 후 다음 명령어를 입력합니다.(wsl 기반. 이때 wsl에서 서버를 연다면 wsl과 windows 간에 포트포워딩을 해야 할 수도 있습니다)
```powershell
uvicorn main:app --reload --host 0.0.0.0 --port 8000

```
```powershell
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --ssl-keyfile key.pem --ssl-certfile cert.pem
```

ssl 인증 생성 명령 linux에서
```powershell
openssl req -x509 -nodes -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365
```

이때 명령어의 뜻은 다음과 같습니다.
main.py 안에 있는 app 모듈을 실행한다.

```--reload``` : 자동으로 재로딩 되게한다(코드 수정하고 저장 시 자동으로 서버 리부트가 됨)

```--host 0.0.0.0``` : 모든 호스트들을 접속할 수 있게 한다

```--port 8000``` : 포트번호를 8000번으로 지정한다


- 이때 각자 컴퓨터에서 할당 받은 ip주소를 가지고 다른 컴퓨터에서 접속을 시도하려면 localhost에서의 방화벽을 해제시켜야 합니다

<gunicorn을 사용하여 멀티 프로세싱을 활용하는 방법>
gunicorn을 통해서 uvicorn을 띄운다. 단 linux에서만 가능함 
```
gunicorn --bind 0.0.0.0:8000 main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --access-logfile access.log
```

<gunicorn config적용>
gunicorn.conf.py 파일 생성
```
workers = 4
worker_class = 'uvicorn.workers.UvicornWorker'
bind = '0.0.0.0:8000'
accesslog = 'access.log'
errorlog = 'error.log'
access_log_format = '%(h)s %(l)s %(u)s %(t)s "%(r)s" %(s)s %(b)s "%(f)s" "%(a)s" %(D)s'
```
```
gunicorn -c gunicorn.conf.py main:app
```

<WSL2 사용시 포트포워딩 하는법>

1. 윈도우 또는 WSL 재부팅시
   ```powershell
   // powershell 관리자 권한으로 실행 후
   netsh interface portproxy reset
   ```

2. 기존 세팅 삭제
   ```powershell
   netsh interface portproxy delete v4tov4 listenport=8000 listenaddress=0.0.0.0
   ```
   -> "지정된 파일을 찾을 수 없습니다" 떠도 괜찮습니다.

4. 새로 포트포워딩 설정
   ```powershell
   netsh interface portproxy add v4tov4 listenport=8000 listenaddress=0.0.0.0 connectport=8000 connectaddress=????
   ```
   -> ????부분은 WSL 안에서 ifconfig으로 나온 ipv4주소를 입력
5. 확인
   ```
   netsh interface portproxy show all
   
   ipv4 수신 대기:             ipv4에 연결:
   
   주소            포트        주소            포트
   --------------- ----------  --------------- ----------
   0.0.0.0         8000        172.19.166.203  8000
   ```


<URL_prefix.json 에서>
```"IP_port": "https://localhost:8000"```
 -> ssl인증서 사용시는 https로 접근해야함
   

---

FrontEnd에서의 이미지 파일은 아직 DB에 없기 때문에 local에서 가져오는 식으로 진행하고 있습니다.
이미지가 들어있는 project_pictures.zip을 /frontend/src/resource 디렉토리 안에 압축을 풀어 넣어주면 됩니다. 이때 저 압축파일들이 하나의 폴더 안에 들어가 있어야 하며 그 폴더명은 project_pictures여야 합니다.

또한 기본적으로 frontEnd가 돌아갈 환경을 만들어주어야 하는데 package.json을 가지고 있다는 가정하에 다음과 같은 명령어를 입력해주시면 됩니다.
```powershell
npm install react
npm install kendo-react-all
npm install
npm audit fix
```

만약 ```npm audit fix``` 명령어를 실행하였을때 작동이 안된다면 ```npm --force audit fix```를 실행해주시면 됩니다.

frontend 파일들을 빌드할 때 EACCES 문제가 뜬다면 ```sudo npm start```를 통해서 실행해주시면 됩니다.

react server 시작시
```PORT=3000 yarn start```
