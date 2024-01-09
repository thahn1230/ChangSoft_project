import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginHeader } from "../../../component/LoginComponents";
import styled from "styled-components";
import { Input, InputChangeEvent } from "@progress/kendo-react-inputs";
import { Button } from "@progress/kendo-react-buttons";
import Join from "pages/Auth/JoinPage";
import { Dialog } from "@progress/kendo-react-dialogs";

import { loginResponse } from "interface/UserInterface";
import { loginRequest } from "services/user/userService";

const LoginWrapper = styled.div`
  width: 100%;
  height: 100vh;
  background-color: whitesmoke;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;

  .container {
    margin-top: 1rem;
    background-color: white;
    padding: 30px;
    height: 380px;
    border: 1px solid lightgray;
    border-radius: 4px;

    .idField,
    .pwField {
      margin-bottom: 1rem;
    }

    .labelfield {
      font-weight: bold;

      .label {
        cursor: default;
      }
    }

    .inputfield {
      margin-top: 5px;
      width: 300px;
      height: 40px;
      border-radius: 4px;
      border: 1px solid lightgray;
    }

    .loginBtn {
      width: 300px;
      height: 40px;
      background-color: #0747a6;
      color: white;
      border: none;
      margin-top: 2.5rem;
      margin-bottom: 0.5rem;
    }
  }

  .checkbox {
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
    margin-top: 1rem;
  }

  .orText {
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    margin: 0.7rem 0;
    font-size: 0.7rem;
  }
  .auth {
    display: flex;
    flex-flow: column nowrap;
  }

  .otherLogins {
    display: flex;
    flex-direction: column;

    .kakaoBtn {
      width: 300px;
      height: 40px;
      margin-bottom: 0.5rem;
    }

    .askBtn {
      width: 300px;
      height: 40px;
      margin-bottom: 0.5rem;
    }

    .faceBookBtn {
      width: 300px;
      height: 40px;
    }
  }

  .join {
    text-align: center;
    margin-top: 1rem;
    color: gray;
    font-weight: bold;

    .joinText:hover {
      cursor: pointer;
      text-decoration: underline;
    }
  }

  .k-form > :first-child {
    margin-top: 0;
  }

  .k-form .k-form-fieldset {
    padding: 0;
    border: 0;

    display: flex;
    flex-flow: column; /* 수정된 부분 */
    justify-content: space-between;
    gap: 1rem;
    
    .idField {
      display: flex;
      flex-flow: column;  
      align-items: flex-start !important;  
      .labelField {
        align-self: flex-start;
      }
    }

    .pwField {
      display: flex;
      flex-flow: column;      
      align-items: flex-start !important;  
      .labelField {
        align-self: flex-start;
      }
    }


  }

  .fieldset {
    display: block;
    margin-inline-start: 2px;
    margin-inline-end: 2px;
    padding-block-start: 0.35em;
    padding-inline-start: 0.75em;
    padding-inline-end: 0.75em;
    padding-block-end: 0.625em;
    min-inline-size: min-content;
    border-width: 2px;
    border-style: groove;
    border-color: rgb(192, 192, 192);
    border-image: initial;
  }

  .fieldset {
    padding: 0.35em 0.75em 0.625em;
  }
`;

const LoginPage = () => {
  const link = `${process.env.REACT_APP_API_URL}/login`;
  const navigator = useNavigate();
  const [inputValues, setInputValues] = useState({
    loginId: "",
    password: "",
  });
  const [isJoinOpen, setIsJoinOpen] = useState<boolean>(false);

  useEffect(() => {
   if(localStorage.getItem("token") !== null)
    navigator("/home");
  }, []);

  const onChange = (event: InputChangeEvent) => {
    const { name, value } = event.target;
    if (name !== undefined) setInputValues({ ...inputValues, [name]: value });
  };

  const sha256 = async (message: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
    return hashHex;
  };

  // useEffect(()=>{
  //   if(tokenContext?.token !== null)
  //     navigator("/home")
  // },[tokenContext?.token])

  const login = async (id: string, password: string) => {
    try {
      //const params = new URLSearchParams();
      const hashedPassword = await sha256(password);

      //params.append("login_info", `["${id}" ,"${hashedPassword}" ]`);

      loginRequest(id,hashedPassword).then((loginData:loginResponse)=>{
        if (loginData.status) {
          localStorage.setItem("token", loginData.token);
          navigator("/home");
          return true;
        } else {
          alert("아이디와 비밀번호를 확인해주세요");
          return false;
        }
      })
    } catch (error) {
      console.error("Error occurred during login:", error);
      return false;
    }
  };

  const onSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    if (inputValues.loginId === "") {
      alert("아이디를 입력하세요");
    } else if (inputValues.password === "") {
      alert("비밀번호를 입력해주세요");
    } else {
      const { loginId, password } = inputValues;
      login(loginId, password);
    }
  };

  const goToJira = () => {
    window.open(link, "_blank");
  };

  const goToHome = () => {
    //window.navigator(link);
  };

  const onJoin = () => {
    setIsJoinOpen(true);
    //navigator("/join");
  };

  const onCloseJoin = () => {
    setIsJoinOpen(false);
  };

  return (
    <div>
      <LoginWrapper>
        <LoginHeader />
        <div className="container">
          <form className={"k-form"} onSubmit={onSubmit}>
            <fieldset className={"k-form-fieldset"}>
              <div className="idField">
                <label className="labelfield">아이디</label>
                <Input
                  className="inputfield"
                  name={"loginId"}
                  type={"text"}
                  placeholder="id를 입력해주세요"
                  //autoFocus={!inputValues.saveLoginId}
                  value={inputValues.loginId}
                  onChange={onChange}
                />
              </div>
              <div className="pwField">
                <label className="labelfield">비밀번호</label>
                <Input
                  className="inputfield"
                  name={"password"}
                  type={"password"}
                  placeholder="비밀번호를 입력해주세요"
                  value={inputValues.password}
                  onChange={onChange}
                />
              </div>
              {/* {loginResult.called && !loginResult.loading && (
                <div>
                  <Error>아이디 또는 비밀번호를 확인해주세요.</Error>
                </div>
              )} */}
            </fieldset>
            <Button className="loginBtn defaultButton" type={"submit"}>
              로그인
            </Button>
          </form>

          {/* <div className="otherLogins">
            <Button className="askBtn cancelButton" onClick={goToJira}>
              프로그램 구매 문의
            </Button>
          </div> */}
          {/* <LoginOptionButtons /> */}

          <div className="join">
            <span className="joinText" onClick={onJoin}>
              계정이 없으신가요?
            </span>
          </div>

          <div className="join">
            <span className="joinText">상담 문의 : 02-563-1328</span>
          </div>
        </div>
      </LoginWrapper>

      {isJoinOpen && (
        <Dialog title={"회원가입"} onClose={onCloseJoin}>
          <Join onCloseJoin={onCloseJoin}></Join>
        </Dialog>
      )}
    </div>
  );
};

export default LoginPage;
