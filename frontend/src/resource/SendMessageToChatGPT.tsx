import axios, { AxiosResponse } from "axios";

const SendMessageToChatGPT = async (message: string): Promise<string> => {
  const fetchData = async () => {
    const response = await fetch("http://10.221.72.46:8000/query", {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: message }),
    });

    //console.log(await response.json());
    const res = (await response.json());
    return res;
  };

  const response = await fetchData();
  console.log(response)
  return response;
};

export default SendMessageToChatGPT;
