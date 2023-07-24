import React, { useCallback, useEffect, useState } from 'react';
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom"
import {
  LoginHeader,
  LoginOptionButtons,
} from "../component/LoginComponents.jsx";
import styled from "styled-components";
import { Input } from "@progress/kendo-react-inputs";
import { Button } from "@progress/kendo-react-buttons";
import { Error } from '@progress/kendo-react-labels';
import { LOGIN } from 'src/queries/user.mutation';
import { setSessionStorage } from 'src/lib/utils/common';
import urlPrefix from "./../resource/URL_prefix.json"

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
    height: 400px;
    border: 1px solid lightgray;
    border-radius: 4px;

    .idField,
    .pwField {
      margin-bottom: 1rem;
    }

    .labelfield {
      font-weight: bold;
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
      // background-color: #1e90ff;
      border: none;
      margin-top: 3rem;
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
`;

const LoginPage = () => {
  const link = urlPrefix + "/login";
  const history = useNavigate();
  const [login, loginResult] = useMutation(LOGIN);
  const [inputValues, setInputValues] = useState({
    loginId: "",
    password: "",
  });
  useEffect(() => {
    const loginId = localStorage.getItem("loginId") ?? undefined;
    setInputValues((inputValues) => ({
      ...inputValues,
      loginId,
    }));
  }, []);

  useEffect(() => {
    if (loginResult.data?.login?.accessToken) {
      const { userId, fullName, accessToken, isMaster } =
        loginResult.data.login;
      const loginform = "normal";
      setSessionStorage("user", {
        userId,
        fullName,
        accessToken,
        isMaster,
        loginform,
      });
      history.push(
        history.location?.state?.from?.pathname ||
          process.env.REACT_APP_LANDING_URL
      );
    }
  }, [loginResult, history]);

  const onChange = ({ target: { name, value } }) => {
    setInputValues({ ...inputValues, [name]: value });
  };

  const onSubmit = useCallback(
    (ev) => {
      console.info("onsubmit ");
      ev.preventDefault();
      const { loginId, password } = inputValues;
      login({
        variables: { input: { loginId, password } },
      });
    },
    [(login, inputValues)]
  );

  const goToJira = () => {
    window.open(link, "_blank");
  };

  const goToHome = () => {
    window.navigator(link);
  }

  const onJoin = () => {
    history.push("/login/join");
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
                  autoFocus={!inputValues.saveLoginId}
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
              {loginResult.called && !loginResult.loading && (
                <div>
                  <Error>아이디 또는 비밀번호를 확인해주세요.</Error>
                </div>
              )}
            </fieldset>
            <Button className="loginBtn defaultButton" primary type={"submit"}>
              로그인
            </Button>
          </form>
          <div className="otherLogins">
            <Button className="askBtn cancelButton" onClick={goToJira}>
              프로그램 구매 문의
            </Button>
          </div>
          <LoginOptionButtons />
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
    </div>
  );
};

export default LoginPage;
