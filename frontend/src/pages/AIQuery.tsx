import React, { useState, useEffect, useRef } from "react";
import {
  Attachment,
  Chat,
  Message,
  User,
} from "@progress/kendo-react-conversational-ui";
import Plot from "react-plotly.js";
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
      setMessages(
        messages.filter((message) => message.text !== "Generating response.")
      );
    }
  }, [isResponding]);

  const handleSend = async (event: any) => {
    const userMessage: Message = {
      author: user,
      text: event.message.text,
    };
    addNewMessage(userMessage);

    setIsResponding(true);
    // const botResponseText = await SendMessageToChatGPT(event.message.text);
    // const botResponseJson = JSON.parse(botResponseText);

    const botResponseJson = await SendMessageToChatGPT(event.message.text);

    console.log(botResponseJson)
    const newAttachment: Attachment[] = [];
    const graphs:JSX.Element[] = [];
    botResponseJson.map((item: any, index:number) => {
      graphs.push((
          <div>
            <Plot
              data={JSON.parse(item.plot)[index].data}
              layout={JSON.parse(item.plot)[index].layout}
            />
            <p>{item.explanation}</p>
          </div>
        ),
      );
    });
    newAttachment.push({contentType:"", content:graphs})

    const botResponse: Message = {
      author: bot,
      text: "",
      attachments: newAttachment,
    };

    setIsResponding(false);
    addNewMessage(botResponse);
  };

  return (
    <div>
      <q>
        이 기능은 실험적인 기능이므로 여러가지 오류와 제한이 존재할 수 있습니다.
      </q>
      <Chat
        messages={messages}
        user={user}
        onMessageSend={handleSend}
        placeholder={isResponding ? "is Loading..." : "Enter your message..."}
        width={"98%"}
      />
    </div>
  );
};

export default AIQuery;
