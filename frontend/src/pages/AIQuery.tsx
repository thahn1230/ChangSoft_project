import React, { useState, useEffect } from 'react';
import { Chat, Message, User } from '@progress/kendo-react-conversational-ui';
import SendMessageToChatGPT from '../resource/SendMessageToChatGPT';

const AIQuery = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  const addNewMessage = (message: Message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const bot: User = {
    id: 0,
    name: '챗봇',
    avatarUrl: 'bot-avatar.png',
  };

  const user: User = {
    id: 1,
    name: '사용자',
    avatarUrl: 'user-avatar.png',
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
      placeholder={'메시지를 입력하세요...'}
    />
  );
};

export default AIQuery;
