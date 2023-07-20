import urlPrefix from "./URL_prefix.json";

const SendMessageToChatGPT = async (message: string): Promise<string> => {
  const fetchData = async () => {
    const response = await fetch(urlPrefix.IP_port + "/query", {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: message }),
    });

    //console.log(await response.json());
    const res = await response.json();
    return res;
  };

  const response = await fetchData();
  return response;
};

export default SendMessageToChatGPT;
