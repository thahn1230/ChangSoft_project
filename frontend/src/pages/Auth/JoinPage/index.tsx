import { Input } from "@progress/kendo-react-inputs";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { UserInfo } from "interface/UserInterface";
import { DropDownList } from "@progress/kendo-react-dropdowns";

const JoinBodyWrapper = styled.div`
  width: 400px;
  height: 700px;
  max-height: 85vh;
  background-color: white;
  border: 1px solid lightgray;
  border-radius: 4px;

  .idField {
    display: flex;
    flex-direction: column;
    align-items: center;

    .labelField {
      width: 350px;
      font-weight: bold;
      margin-top: 1rem;
    }

    .input-btn-field {
      display: flex;

      .inputField {
        margin-top: 10px;
        margin-right: 25px;
        width: 250px;
        height: 35px;

        &:focus {
          border: 3px solid rgba(0, 0, 255, 0.1);
        }
      }

      .duplicateCheckBtn {
        width: 75px;
        height: 35px;
        margin-top: 10px;
        justify-content: center;
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
  }

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
        width: 350px;
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

  .drop-down-field {
    display: flex;
    flex-direction: column;
    align-items: center;

    .labelField {
      justify-content: flex-start;
      display: flex !important;
      width: 350px;
      font-weight: bold;
      margin-top: 1rem;
    }
    .user-type-list {
      margin-top: 10px;
      width: 350px;
      height: 35px;

      &:focus {
        border: 3px solid rgba(0, 0, 255, 0.1);
      }
    }
  }
  
  .btns {
    display: flex;
    padding-top: 1rem;
    padding-bottom: 1rem;
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

// const sha256 = async (message: string) => {
//   const encoder = new TextEncoder();
//   const data = encoder.encode(message);
//   const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
//   const hashArray = Array.from(new Uint8Array(hashBuffer));
//   const hashHex = hashArray
//     .map((byte) => byte.toString(16).padStart(2, "0"))
//     .join("");
//   return hashHex;
// };

const Join = (props: any) => {
  const [phoneNum, setPhoneNum] = useState("");
  const [isPhoneValid, setIsPhoneValid] = useState(false);

  const [emailValue, setEmailValue] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);

  const [joinValue, setJoinValue] = useState<JoinValueI>({
    id: "",
    password: "",
    name: "",
    job_position: "",
    company: "",
    email_address: "",
    phone_number: "",
    user_type: "",
  });

  const [idValue, setIdValue] = useState("");
  const [isIdValid, setIsIdValid] = useState(false);
  const [isIdDuplicate, setIsIdDuplicate] = useState<boolean | null>(true);
  //const [isEmailDuplicate, setIsEmailDuplicate] = useState<boolean>(false);

  const [pwValue, setPwValue] =useState("");
  const [isPwValid, setIsPwValid] =useState(false);


  const userTypes = ["Admin", "User", "Others"];
  const [selectedUserType, setSelectedUserType] = useState<string>("User");

  const [signupDone, setSignupDone] = useState<boolean | null>(null);

  const telValidator = async (data: any) => {
    const num = data.split("-").join("");
    const isInt = Number.isInteger(Number(num));
    const numLength = num.slice(0).length === 11 ? true : false;

    if (isInt && numLength) {
      if (data.length === 11) {
        const formattedPhoneNum =
          data.slice(0, 3) + "-" + data.slice(3, 7) + "-" + data.slice(7, 11);

        setPhoneNum(formattedPhoneNum);
        setJoinValue( await { ...joinValue, phone_number: formattedPhoneNum });
      }
      setIsPhoneValid(true);
    } else {
      setIsPhoneValid(false);
    }
  };

  const backToLogin = () => {
    props.onCloseJoin();
  };

  const signup = async (newUserInfo: JoinValueI) => {
    //여기서는 무조건 valid joinValue가 들어왔다고 가정

    try {
      // const hashedPassword = await sha256(newUserInfo.password);
      setJoinValue(
        await {
          ...joinValue,
          password: newUserInfo.password,
          user_type: "User",
        }
      );
      const updatedJoinValue = {
        ...joinValue,
        password: newUserInfo.password,
        user_type: "User",
      };

      //params는 어떻게씀
      const response = await fetch(`${process.env.REACT_APP_API_URL}/sign_up`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ join_info: updatedJoinValue }),
      });

      const signupData: UserInfo[] = await response.json();
      console.log(signupData);
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
      const response = await fetch(`${process.env.REACT_APP_API_URL}/sign_up/check_id`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id_info: { id: joinValue.id } }),
      });

      //console.log(await response.json())
      //const signupData: UserInfoI[] = JSON.parse(await response.json());
      const isIdValid = (await response.json()).result;

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

  const idValidator = (data :any)=>{
    const idRegex: RegExp = /^[a-zA-Z][a-zA-Z0-9]*\d[a-zA-Z0-9]*$/;

    // Convert data to a string (in case it's not already)
    const dataStr = String(data);
  
    // Test if the ID matches the regex pattern
    console.log(idRegex.test(dataStr))
    setIsIdValid(idRegex.test(dataStr));
    
  }
  const onIdChange = (e: any) => {
    setIdValue(e.value)
    idValidator(e.value)
    setJoinValue({ ...joinValue, id: e.value });
  };

  const pwValidator=(data:any)=>
  {
    const pwRegex: RegExp =/^[a-zA-Z][a-zA-Z0-9!@#$%^&*]*\d[a-zA-Z0-9!@#$%^&*]*$/;
    const dataStr = String(data);
  
    console.log(pwRegex.test(dataStr))
    setIsPwValid(pwRegex.test(dataStr));
  }

  const onPwChange = (e: any) => {
    setPwValue(e.value)
    pwValidator(e.value)
    setJoinValue({ ...joinValue, password: e.value });
  };

  const onCompanyChange = (e: any) => {
    setJoinValue({ ...joinValue, company: e.value });
  };

  const onNameChange = (e: any) => {
    setJoinValue({ ...joinValue, name: e.value });
  };

  const onJobPositionChange = (e: any) => {
    setJoinValue({ ...joinValue, job_position: e.value });
  };

  const emailCheck = (email: any) => {
    var regex =
      /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    let isValidEmail =
      email !== "" && email !== "undefined" && regex.test(email);
    setIsEmailValid(isValidEmail);
    return isValidEmail;
  };

  const onEmailChange = (e: any) => {
    setEmailValue(e.value);
    emailCheck(e.value);
    setJoinValue({ ...joinValue, email_address: e.value });
  };

  const onPhoneChange = (e: any) => {
    setPhoneNum(e.value);
    telValidator(e.value);
    setJoinValue({ ...joinValue, phone_number: e.value });
  };

  const onSubmit = async () => {
    if (!joinValue.id || !joinValue.password) {
      alert("아이디 또는 비밀번호가 입력되지 않았습니다.");
      return;
    }

    if(!isIdValid)
    {
      alert("아이디 형식이 올바르지 않습니다.");
      return;
    }
    if(!isPwValid)
    {
      alert("비밀번호 형식이 올바르지 않습니다.");
      return;
    }
    if (isIdDuplicate) {
      alert("아이디 중복확인을 해주세요.");
      return;
    }
    if (!joinValue.name) {
      alert("이름을 입력하지 않았습니다.");
      return;
    }
    if (emailValue === "") {
      alert("이메일을 입력하지 않았습니다.");
      return;
    } else if (!isEmailValid) {
      alert("이메일 형식이 올바르지 않습니다.");
      return;
    }

    if (phoneNum === "") {
      alert("전화번호를 입력해주세요.");
      return;
    } else if (!isPhoneValid) {
      alert("전화번호 형식이 올바르지 않습니다.");
      return;
    }

    setSignupDone(await signup(joinValue));
  };

  const onSelectedUserType=(e:any)=>{
    setSelectedUserType(e.target.value);
  }

  useEffect(()=>{setJoinValue({...joinValue, user_type:selectedUserType})},[selectedUserType])
  useEffect(() => {
    if (signupDone === null) return;

    if (signupDone) {
      alert("가입 완료되었습니다.");
      backToLogin();
    } else {
      alert("잘못 된 값이 입력되었습니다. 확인 하시기 바랍니다.");
    }
  }, [signupDone]);
  return (
    <JoinBodyWrapper>
      <div className="idField">
        <div className="labelField">아이디</div>
        <div className="input-btn-field">
          <Input
            className="inputField"
            type="text"
            placeholder="사용하실 아이디를 입력해주세요"
            onChange={onIdChange}
            value={idValue}
          ></Input>
          <button onClick={checkIdDuplicate} className="duplicateCheckBtn">
            중복확인
          </button>
        </div>
      </div>
      <div className="pwField">
        <div className="labelField">비밀번호 (32글자 이내로 작성해주세요)</div>
        <Input
          className="inputField"
          type="password"
          placeholder="영문+숫자 조합을 이용해주세요"
          onChange={onPwChange}
          value={pwValue}
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
          value={emailValue}
        ></Input>
      </div>
      <div className="emailField">
        <div className="labelField">회사</div>
        <Input
          className="inputField"
          type="text"
          placeholder="회사를 입력해주세요"
          onChange={onCompanyChange}
        ></Input>
      </div>
      <div className="emailField">
        <div className="labelField">직위</div>
        <Input
          className="inputField"
          type="text"
          placeholder="직위를 입력해주세요(선택사항입니다)"
          onChange={onJobPositionChange}
        ></Input>
      </div>
      <div className="phoneField">
        <div className="labelField">휴대전화 번호</div>
        <div className="phoneConfirm">
          <Input
            className="phoneInputField"
            type="text"
            placeholder="예) 010-1111-1111, 01012341234(선택사항입니다)"
            onChange={onPhoneChange}
            value={phoneNum}
          ></Input>
          {/* <button className='confirmBtn' onClick={onPhoneConfirm}>
                인증
              </button> */}
        </div>
      </div>
      <div className="drop-down-field">
                <div className="labelField">User Type</div>
                <DropDownList
                  className="user-type-list"
                  data={userTypes}
                  defaultValue={joinValue.user_type}
                  value={selectedUserType}
                  onChange={onSelectedUserType}
                />
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
