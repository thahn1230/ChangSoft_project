import axios, { AxiosResponse } from 'axios';
import apiKey from "./chatGPT_api.json";

interface ChatGPTResponse {
  choices: any;
  data: {
    choices: {
      message: {
        content: string;
      };
    }[];
  };
}

const SendMessageToChatGPT = async (message: string): Promise<string> => {
  try {
    const response: AxiosResponse<ChatGPTResponse> = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are User' },
          { role: 'user', content: message },
          { role: 'assistant', content: '' },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey.API_key}`,
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error:', error);
    throw new Error('Chat GPT API 요청에 실패했습니다.');
  }
};

export default SendMessageToChatGPT;
