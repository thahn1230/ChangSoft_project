import { pagerTotalPages } from "@progress/kendo-react-grid/dist/npm/messages";
import { Input } from "@progress/kendo-react-inputs";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { UserInfoI } from "./../interface/userInfo_interface";
import urlPrefix from "./../resource/URL_prefix.json";
import { useUserContext } from "./../UserInfoContext";
import { DropDownList } from "@progress/kendo-react-dropdowns";

const JoinBodyWrapper = styled.div`
  width: 400px;
  height: 600px;
  background-color: white;
  border: 1px solid lightgray;
  border-radius: 4px;

  .idField,
  .pwField,
  .nameField,
  .emailField,
  .cpmpanyField,
  .jobPositionField {
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
      justify-content: flex-start;
      display: flex !important;
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
      margin-right: 1rem;
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

    .changePwBtn {
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

  .duplicateCheckBtn {
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
`;
const ChangePwBodyWrapper = styled.div`
  width: 400px;
  height: 550px;
  background-color: white;
  border: 1px solid lightgray;
  border-radius: 4px;

  .current-password-field,
  .new-password-field,
  .confirm-password-field {
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

    .inputField {
      margin-top: 1rem !important;
      width: 350px;
      height: 35px;

      &:focus {
        border: 3px solid rgba(0, 0, 255, 0.1);
      }
    }
  }

  .btns {
    display: flex;
    margin-top: 3rem;
    justify-content: center;

    .backBtn,
    .changePwBtn {
      mnax-width: 100px;
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

    .changePwBtn {
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

const User = (props: any) => {
  const userInfoContext = useUserContext();
  //const [checked, setChecked] = useState(false);
  const history = useNavigate();
  const [phoneNum, setPhoneNum] = useState("");
  const [phoneVal, setPhoneVal] = useState(false);
  const [emailVal, setEmailVal] = useState(false);

  const [IsloginIdValid, setIsloginIdValid] = useState(true);
  const [IsEmailValid, setEmailValid] = useState(true);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

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

  const [signupDone, setSignupDone] = useState<boolean>(false);
  const [isIdDuplicate, setIsIdDuplicate] = useState<boolean | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const userTypes = ["Admin", "User", "Others"];
  const [selectedUserType, setSelectedUserType] = useState<string>(joinValue.user_type);

  const navigator = useNavigate();
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

  const backToHome = () => {
    navigator("/home");
  };

  const signup = async (newUserInfo: JoinValueI) => {
    try {
      setJoinValue(
        await {
          ...joinValue,
        }
      );
      const updatedJoinValue = {
        ...joinValue,
      };

      //params는 어떻게씀
      const response = await fetch(`${urlPrefix.IP_port}/user/change_info`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ join_info: updatedJoinValue }),
      });

      const signupData: boolean = await response.json();
      if (signupData) {
        //회원가입 성공
        window.location.reload();
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

  const changePw = async (newPassword: string, currentPassword: string) => {
    try {
      const hashedPassword = await sha256(currentPassword);
      const hashedNewPassword = await sha256(newPassword);

      const updatedPwValue = {
        current_pw: hashedPassword,
        changed_pw: hashedNewPassword,
      };

      //params는 어떻게씀
      const response = await fetch(`${urlPrefix.IP_port}/user/change_pw`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ pw_info: updatedPwValue }),
      });

      const changePwData: boolean = await response.json();
      console.log(changePwData);
      if (changePwData) {
        //비밀번호 변경 성공
        return true;
      } else {
        //비밀번호 변경 실패
        return false;
      }
    } catch (error) {
      console.error("Error occurred during change pw:", error);
      return false;
    }
  };

  const emailDuplicate = async (inputEmail: string) => {};

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
    setJoinValue({ ...joinValue, phone_number: e.value });
  };

  const onPhoneConfirm = () => {
    setJoinValue({ ...joinValue, phone_number: "modify it to inputphoneNum" });
  };

  const onCompanyChange = (e: any) => {
    setJoinValue({ ...joinValue, company: e.value });
  };

  const onJobPositionChange = (e: any) => {
    setJoinValue({ ...joinValue, job_position: e.value });
  };

  const onPrev = () => {
    history("/");
  };

  const onSelectedUserType = (e: any) => {
    setSelectedUserType(e.target.value);
    setJoinValue({ ...joinValue, user_type: e.target.value });
  };

  const handlePasswordChange = async () => {
    // Validate if the new password and confirm new password match

    if (newPassword.length > 32) {
      alert("password는 32글자 이내로 작성해주세요");
    }
    if (newPassword === confirmNewPassword) {
      let changePwResult = await changePw(newPassword, currentPassword);

      if (changePwResult) {
        alert("변경 완료되었습니다.");
        backToHome();
      } else {
        alert("잘못 된 값이 입력되었습니다. 확인하시기 바랍니다.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
        return;
      }
    } else {
      alert("새로운 비밀번호와 확인 비밀번호가 일치하지 않습니다.");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      return;
    }

    // Close the modal
    setModalOpen(false);

    // Clear the password fields
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
  };

  const closeModal = () => {
    // Close the modal without changing the password
    setModalOpen(false);

    // Clear the password fields
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
  };

  const onSubmit = async () => {
    if (!joinValue.name) {
      alert("이름을 입력하지 않았습니다.");
      return;
    }
    if (!joinValue.email_address) {
      alert("이메일을 입력하지 않았습니다.");
      return;
    }
    if (!joinValue.company) {
      alert("회사를 입력하지 않았습니다.");
      return;
    }

    if (joinValue.email_address && joinValue.phone_number) {
      let signUpResult = await signup(joinValue);

      if (signUpResult) {
        alert("변경 완료되었습니다.");
        backToHome();
      } else {
        alert("잘못 된 값이 입력되었습니다. 확인 하시기 바랍니다.");
      }
    } else {
      let signUpResult = await signup(joinValue);

      if (signUpResult) {
        alert("변경 완료되었습니다.");
        backToHome();
      } else {
        alert("오류가 발생되었습니다.");
      }
    }
  };

  const onChangePW = async () => {
    setModalOpen(true);
  };

  useEffect(() => {
    fetch(urlPrefix.IP_port + "/user/profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // user 정보를 받아와서 전부 저장해놔야 함(pw 빼고)
        const userProfile: JoinValueI = {
          company: data.company,
          email_address: data.email_address,
          id: data.id,
          job_position: data.job_position,
          name: data.name,
          phone_number: data.phone_number,
          user_type: data.user_type,
          password: "",
        };
        setJoinValue(userProfile);
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  useEffect(()=>{

    //user type을 바로 바로 수정해주려면 useEffect를 사용해야 할 것 같음
    setSelectedUserType(joinValue.user_type)
  },[joinValue])

  return (
    <div>
      {!isModalOpen ? (
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "90vh",
            backgroundColor: "whitesmoke",
            flexFlow: "column",
            WebkitBoxPack: "center",
            justifyContent: "center",
            WebkitBoxAlign: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: "350px",
              fontWeight: "bold",
              marginTop: "1rem",
              marginBottom: "1rem",
            }}
          >
            내 정보
          </div>
          <JoinBodyWrapper>
            <div className="nameField">
              <div className="labelField">이름</div>
              <Input
                className="inputField"
                type="text"
                value={joinValue.name}
                onChange={onNameChange}
              ></Input>
            </div>
            <div className="emailField">
              <div className="labelField">이메일</div>
              <Input
                className="inputField"
                type="text"
                value={joinValue.email_address}
                onChange={onEmailChange}
              ></Input>
              {!IsEmailValid && <div>이메일이 중복되었습니다.</div>}
            </div>
            <div className="phoneField">
              <div className="labelField">휴대전화 번호</div>
              <div className="phoneConfirm">
                {joinValue.phone_number ? (
                  <Input
                    className="phoneInputField"
                    type="text"
                    value={joinValue.phone_number}
                    onChange={onPhoneChange}
                  ></Input>
                ) : (
                  <Input
                    className="phoneInputField"
                    type="text"
                    placeholder="예) 010-1111-1111, 01012341234 (선택사항입니다)"
                    onChange={onPhoneChange}
                  ></Input>
                )}
              </div>
            </div>
            <div className="cpmpanyField">
              <div className="labelField">회사</div>
              <Input
                className="inputField"
                type="text"
                value={joinValue.company}
                onChange={onCompanyChange}
              ></Input>
            </div>
            <div className="jobPositionField">
              <div className="labelField">직위</div>
              {joinValue.job_position ? (
                <Input
                  className="inputField"
                  type="text"
                  value={joinValue.job_position}
                  onChange={onJobPositionChange}
                ></Input>
              ) : (
                <Input
                  className="inputField"
                  type="text"
                  placeholder="예) 대리, 사원 (선택사항입니다)"
                  onChange={onJobPositionChange}
                ></Input>
              )}
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
            </div>
            <div className="btns">
              <button className="backBtn" onClick={backToHome}>
                취소
              </button>
              <button className="joinBtn" onClick={onSubmit}>
                변경하기
              </button>
              <>
                <button className="changePwBtn" onClick={onChangePW}>
                  비밀번호 변경하기
                </button>
              </>
            </div>
          </JoinBodyWrapper>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "90vh",
            backgroundColor: "whitesmoke",
            flexFlow: "column",
            WebkitBoxPack: "center",
            justifyContent: "center",
            WebkitBoxAlign: "center",
            alignItems: "center",
          }}
        >
          <ChangePwBodyWrapper>
            <div className="modal">
              <div className="modal-content">
                <h2>비밀번호 변경</h2>
                <div className="current-password-field">
                  <div className="labelField">현재 비밀번호</div>
                  <Input
                    className="inputField"
                    placeholder="현재 비밀번호를 입력해주세요."
                    type="password"
                    onChange={(e) => setCurrentPassword(e.value)}
                  />
                </div>
                <div className="new-password-field">
                  <div className="labelField">새로운 비밀번호</div>
                  <Input
                    className="inputField"
                    type="password"
                    placeholder="32글자 이내로 작성해주세요."
                    onChange={(e) => setNewPassword(e.value)}
                  />
                </div>
                <div className="confirm-password-field">
                  <div className="labelField">새로운 비밀번호 확인</div>
                  <Input
                    className="inputField"
                    type="password"
                    placeholder="새로운 비밀번호를 다시 입력해주세요."
                    onChange={(e) => setConfirmNewPassword(e.value)}
                  />
                </div>
                <div className="btns">
                  <button className="backBtn" onClick={closeModal}>
                    취소
                  </button>
                  <button
                    className="changePwBtn"
                    onClick={handlePasswordChange}
                  >
                    비밀번호 변경
                  </button>
                </div>
              </div>
            </div>
          </ChangePwBodyWrapper>
        </div>
      )}
    </div>
  );
};

export default User;
