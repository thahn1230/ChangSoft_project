import React, { useState, useEffect } from "react";
import { Chat, Message, User } from "@progress/kendo-react-conversational-ui";
import SendMessageToChatGPT from "../resource/SendMessageToChatGPT";
import chatgptLogo from "./../resource/chatgpt_logo.png";
import "./../styles/AIQuery.scss";

const AIQuery = () => {
  const [messages, setMessages] = useState<Message[]>([]);

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

  const handleSend = async (event: any) => {
    const userMessage: Message = {
      author: user,
      text: event.message.text,
    };
    addNewMessage(userMessage);

    const botResponseText = await SendMessageToChatGPT(event.message.text);

    const botResponse: Message = {
      author: bot,
      text: botResponseText,
    };
    addNewMessage(botResponse);
  };

  return (
    <Chat
      messages={messages}
      user={user}
      onMessageSend={handleSend}
      placeholder={"Enter your message..."}
      width={"98%"}
    />
  );
};

export default AIQuery;
