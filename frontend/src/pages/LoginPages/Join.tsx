import { pagerTotalPages } from "@progress/kendo-react-grid/dist/npm/messages";
import { Input } from "@progress/kendo-react-inputs";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { UserInfoI } from "./../../interface/userInfo_interface";
import urlPrefix from "./../../resource/URL_prefix.json";
import { useUserContext } from "./../../UserInfoContext";

const JoinBodyWrapper = styled.div`
  width: 400px;
  height: 600px;
  background-color: white;
  border: 1px solid lightgray;
  border-radius: 4px;

  .idField,
  .pwField,
  .nameField,
  .emailField {
    display: flex;
    flex-direction: column;
    align-items: center;

    .labelField {
      width: 350px;
      font-weight: bold;
      margin-top: 1rem;
    }

    .inputField {
      margin-top: 10px;
      width: 350px;
      height: 35px;

      &:focus {
        border: 3px solid rgba(0, 0, 255, 0.1);
      }
    }
  }

  .phoneField {
    display: flex;
    flex-direction: column;
    align-items: center;

    .labelField {
      width: 350px;
      font-weight: bold;
      margin-top: 1rem;
    }

    .phoneConfirm {
      width: 350px;
      display: flex;
      justify-content: space-between;

      .phoneInputField {
        margin-top: 10px;
        width: 250px;
        height: 35px;

        &:focus {
          border: 3px solid rgba(0, 0, 255, 0.1);
        }
      }

      .confirmBtn {
        margin-top: 10px;
        width: 80px;
        height: 35px;
        border: none;
        border-radius: 4px;
        outline: none;
        background-color: #1e90ff;
        color: white;

        &:hover {
          cursor: pointer;
          background-color: skyblue;
        }
      }
    }
  }

  .checkField {
    display: flex;
    justify-content: center;
    margin-top: 1rem;

    .checkContainer {
      width: 350px;
      display: flex;
      align-items: center;

      span {
        font-size: 0.8rem;
      }
    }
  }

  .btns {
    display: flex;
    margin-top: 3rem;
    justify-content: center;

    .backBtn,
    .joinBtn {
      width: 100px;
      height: 30px;
    }

    .backBtn {
      margin-right: 1rem;
      color: white;
      background-color: darkgray;
      border: none;
      border-radius: 4px;
      outline: none;

      &:hover {
        cursor: pointer;
        background-color: gray;
      }
    }

    .joinBtn {
      color: white;
      background-color: #1e90ff;
      border: none;
      border-radius: 4px;
      outline: none;

      &:hover {
        cursor: pointer;
        background-color: skyblue;
      }
    }
  }
`;

//이거에 맞게 입력 form 추가해야함
//각 form에 따른 valid 체크와 duplicate체크 각각 해야함
interface JoinValueI {
  id: string;
  password: string;
  name: string;
  job_position: string | null;
  company: string;
  email_address: string;
  phone_number: string | null;
  user_type: string;
}

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

const Join = (props: any) => {
  const userInfoContext = useUserContext();
  //const [checked, setChecked] = useState(false);
  const history = useNavigate();
  const [phoneNum, setPhoneNum] = useState("");
  const [phoneVal, setPhoneVal] = useState(false);
  const [emailVal, setEmailVal] = useState(false);

  const [IsloginIdValid, setIsloginIdValid] = useState(true);
  const [IsEmailValid, setEmailValid] = useState(true);

  const [joinValue, setJoinValue] = useState<JoinValueI>({
    id: "",
    password: "",
    name: "",
    job_position: "",
    company: "",
    email_address: "",
    phone_number: "",
    user_type: "User",
  });

  const [signupDone, setSignupDone] = useState<boolean>(false);
  const [isIdDuplicate, setIsIdDuplicate] = useState<boolean | null>(null);
  //const [isEmailDuplicate, setIsEmailDuplicate] = useState<boolean>(false);

  const telValidator = (data: any) => {
    const num = data.split("-").join("");
    const isInt = Number.isInteger(Number(num));
    const numLength = num.slice(0).length === 11 ? true : false;

    if (isInt && numLength) {
      setPhoneVal(true);
    } else {
      setPhoneVal(false);
    }
  };

  const backToLogin = () => {
    props.onCloseJoin();
  };

  const signup = async (newUserInfo: JoinValueI) => {
    if (isIdDuplicate === null) {
      alert("아이디 중복확인을 해주세요.");
      return;
    }
    try {
      const hashedPassword = await sha256(newUserInfo.password);
      setJoinValue(
        await {
          ...joinValue,
          password: hashedPassword,
          company: "창소프트아이앤아이",
          user_type: "User",
        }
      );

      //params는 어떻게씀
      const response = await fetch(`${urlPrefix.IP_port}/sign_up`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ join_info: joinValue }),
      });

      const signupData: UserInfoI[] = await response.json();
      console.log(signupData)
      if (signupData.length !== 0) {
        //회원가입 성공
        return true;
      } else {
        //회원가입 실패
        return false;
      }
    } catch (error) {
      console.error("Error occurred during signup:", error);
      return false;
    }
  };

  const checkIdDuplicate = async () => {
    try {
      const response = await fetch(`${urlPrefix.IP_port}/sign_up/check_id`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id_info: { id: joinValue.id } }),
      });

      //console.log(await response.json())
      //const signupData: UserInfoI[] = JSON.parse(await response.json());
      const isIdValid =(await response.json()).result;

      if (isIdValid) {
        //중복아님
        alert("사용 가능한 아이디입니다.");
        setIsIdDuplicate(false);
      } else {
        //중복임
        alert("중복된 아이디입니다. 다른 아이디를 입력해주세요.");
        setIsIdDuplicate(true);
      }
      return;
    } catch (error) {
      console.error("Error occurred during login:", error);
      return;
    }
  };

  // 이거구현해야됨
  const emailDuplicate = async (inputEmail: string) => {};

  const onIdChange = (e: any) => {
    setJoinValue({ ...joinValue, id: e.value });
  };

  const onPwChange = (e: any) => {
    setJoinValue({ ...joinValue, password: e.value });
  };

  const onNameChange = (e: any) => {
    setJoinValue({ ...joinValue, name: e.value });
  };

  const emailCheck = (email: any) => {
    var regex =
      /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    let isValidEmail =
      email !== "" && email !== "undefined" && regex.test(email);
    setEmailVal(isValidEmail);
    return isValidEmail;
  };

  const onEmailChange = (e: any) => {
    let isValidEmail = emailCheck(e.value);
    setJoinValue({ ...joinValue, email_address: e.value });

    if (!isValidEmail) return;

    emailDuplicate(e.value);
  };

  const onPhoneChange = (e: any) => {
    setPhoneNum(e.value);
    telValidator(e.value);
  };

  const onPhoneConfirm = () => {
    setJoinValue({ ...joinValue, phone_number: "modify it to inputphoneNum" });
  };

  const onPrev = () => {
    history("/");
  };

  const onSubmit = async () => {
    if (!joinValue.id || !joinValue.password) {
      alert("아이디 또는 비밀번호가 입력되지 않았습니다.");
      return;
    }
    if (!joinValue.name) {
      alert("이름을 입력하지 않았습니다.");
      return;
    }
    if (!emailVal) {
      alert("이메일을 입력하지 않았습니다.");
      return;
    }
    if (!phoneVal) {
      alert("휴대폰 번호를 입력하지 않았습니다.");
      return;
    }

    if (phoneVal && emailVal) {
      let signUpResult = await signup(joinValue);

      if (signUpResult) {
        alert("가입 완료되었습니다.");
        backToLogin();
      } else {
        alert("잘못 된 값이 입력되었습니다. 확인 하시기 바랍니다.");
      }
    } else {
      if (!phoneVal) {
        alert("전화번호 형식이 올바르지 않습니다.");
      } else if (!emailVal) {
        alert("이메일 형식이 올바르지 않습니다.");
      } else {
        alert("오류");
      }
    }
  };

  return (
    <JoinBodyWrapper>
      <div className="idField">
        <div className="labelField">아이디</div>
        <Input
          className="inputField"
          type="text"
          placeholder="사용하실 아이디를 입력해주세요"
          onChange={onIdChange}
        ></Input>
        <button onClick={checkIdDuplicate}>중복확인</button>
        {!IsloginIdValid && <div>아이디가 중복되었습니다.</div>}
      </div>
      <div className="pwField">
        <div className="labelField">비밀번호</div>
        <Input
          className="inputField"
          type="password"
          placeholder="영문+숫자 조합을 이용해주세요"
          onChange={onPwChange}
        ></Input>
      </div>
      <div className="nameField">
        <div className="labelField">이름</div>
        <Input
          className="inputField"
          type="text"
          placeholder="이름(실명)을 입력해주세요"
          onChange={onNameChange}
        ></Input>
      </div>
      <div className="emailField">
        <div className="labelField">이메일</div>
        <Input
          className="inputField"
          type="text"
          placeholder="이메일을 입력해주세요"
          onChange={onEmailChange}
        ></Input>
        {!IsEmailValid && <div>이메일이 중복되었습니다.</div>}
      </div>
      <div className="phoneField">
        <div className="labelField">휴대전화 번호</div>
        <div className="phoneConfirm">
          <Input
            className="phoneInputField"
            type="text"
            placeholder="예) 010-1111-1111, 01012341234"
            onChange={onPhoneChange}
          ></Input>
          {/* <button className='confirmBtn' onClick={onPhoneConfirm}>
                인증
              </button> */}
        </div>
      </div>
      {/* <div className='checkField'>
            <div className='checkContainer'>
              <Checkbox
                checked={checked}
                color='primary'
                onChange={handleChange}
                inputProps={{ 'aria-label': 'primary checkbox' }}
              />
              <span>이용약관 및 개인정보 처리방침에 동의합니다. (필수)</span>
            </div>
          </div> */}
      <div className="btns">
        <button className="backBtn" onClick={backToLogin}>
          이전
        </button>
        <button className="joinBtn" onClick={onSubmit}>
          가입하기
        </button>
      </div>
    </JoinBodyWrapper>
  );
};

export default Join;
