import apiService from "services/apiService";
import { JoinInputValue } from "interface/UserInterface";

const getUserProfile = async () => {
  const response = await apiService.get("user/profile", true);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const userData = await response.json();

  return userData;
};

const loginRequest = async (id: string, password: string) => {
  const response = await apiService.post("login", {
    login_info: { id: id, password: password },
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const userData = await response.json();

  return userData;
};

const changeUserInfo = async (updatedJoinValue: JoinInputValue) => {
  const response = await apiService.post("user/change_info", {
    join_info: updatedJoinValue,
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const joinResponse = await response.json();

  return joinResponse;
};

const changePassword = async (updatedPwValue: {
  current_pw: string;
  changed_pw: string;
}) => {
    const response = await apiService.post("user/change_pw", { pw_info: updatedPwValue });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
  
    const changePwResponse = await response.json();
  
    return changePwResponse;
};
export { getUserProfile, loginRequest, changeUserInfo, changePassword };
