import urlPrefix from "./URL_prefix.json";

const SendMessageToChatGPT = async (message: string): Promise<any> => {
  try {
    //return "hello";
    const response = await fetch(urlPrefix.IP_port + "/query", {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: message }),
    });

    // console.log(await response.json());
    //const res = await response.json();
    const res = await response.json();
    console.log(res)
    return res;
    //return res
  } catch (error) {
    console.error("Error fetching data:", error);
    return "error"
  }
};

export default SendMessageToChatGPT;
