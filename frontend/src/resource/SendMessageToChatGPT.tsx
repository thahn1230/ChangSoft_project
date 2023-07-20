import urlPrefix from "./URL_prefix.json";

const SendMessageToChatGPT = async (message: string): Promise<string> => {
  const fetchData = async () => {
    try {
      return "hello";
      const response = await fetch(urlPrefix.IP_port + "/query", {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: message }),
      });

      console.log(await response);

      const res = await response.json();
      return res;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const response = await fetchData();
  return response;
};

export default SendMessageToChatGPT;
