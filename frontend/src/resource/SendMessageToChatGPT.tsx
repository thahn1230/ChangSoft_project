import axios from "axios";
import chatGPT from "./chatGPT_api.json";

const SendMessageToChatGPT = async (messageText: string): Promise<string> => {
 
  try {
    console.log(`Bearer ${chatGPT.API_key}`);

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        message: messageText,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${chatGPT.API_key}`,
        },
      }
    );

    // console.log(response.data.choices[0].message);
    // return response.data;
    return "hello";
  } catch (error) {
    console.error("Chat GPT API 오류:", error);
    return "챗봇과의 통신 중 오류가 발생했습니다.";
  }
};

export default SendMessageToChatGPT;
