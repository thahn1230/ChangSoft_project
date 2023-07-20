import React, { useState, useEffect } from "react";
import { Chat, Message, User } from "@progress/kendo-react-conversational-ui";
import SendMessageToChatGPT from "../resource/SendMessageToChatGPT";
import chatgptLogo from "./../resource/chatgpt_logo.png";
import "./../styles/AIQuery.scss";

const AIQuery = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isResponding, setIsResponding] = useState<boolean>(false);

  const addNewMessage = (message: Message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const bot: User = {
    id: 0,
    name: "챗봇",
    avatarUrl: chatgptLogo,
  };

  const user: User = {
    id: 1,
    name: "사용자",
  };

  useEffect(() => {
    if (isResponding) {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          author: { id: 0, name: "챗봇" },
          selectionIndex: 0,
          text: "Generating response.",
        },
      ]);
    } else if (!isResponding) {
      setMessages(messages.filter((message)=>{return message.text !== "Generating response."}))
    }
  }, [isResponding]);

  const handleSend = async (event: any) => {
    const userMessage: Message = {
      author: user,
      text: event.message.text,
    };
    addNewMessage(userMessage);

    setIsResponding(true);
    const botResponseText = await SendMessageToChatGPT(event.message.text);

    const botResponse: Message = {
      author: bot,
      text: botResponseText,
    };
    setIsResponding(false);
    addNewMessage(botResponse);
    setIsResponding(false);
  };

  return (
    <div>
      <q>이 기능은 실험적인 기능이므로 여러가지 오류와 제한이 존재할 수 있습니다.</q>
      <Chat
        messages={messages}
        user={user}
        onMessageSend={handleSend}
        placeholder={"Enter your message..."}
        width={"98%"}
      />

      {isResponding ? <div>is loading</div> : <div>입력하세요</div>}
    </div>
  );
};

export default AIQuery;
