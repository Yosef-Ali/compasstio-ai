"use client"

import { useEffect, useState } from 'react';

import { StreamChat } from 'stream-chat';
import {
  Channel,
  ChannelHeader,
  ChannelList,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from 'stream-chat-react';

import '@stream-io/stream-chat-css/dist/css/index.css';

export default function WhatsAppChat() {
  const apiKey = process.env.NEXT_PUBLIC_REACT_APP_STREAM_KEY || 'Set API Key';
  const userId = process.env.NEXT_PUBLIC_REACT_APP_CHAT_USER_ID_DUMMY || 'Set USER ID';
  const userToken = process.env.NEXT_PUBLIC_REACT_APP_CHAT_USER_TOKEN_DUMMY;

  const [chatClient, setChatClient] = useState<StreamChat>(StreamChat.getInstance(apiKey));

  useEffect(() => {
    //   const chatClient = StreamChat.getInstance(apiKey);

    chatClient.connectUser({ id: userId }, userToken);

    const channel = chatClient.channel('messaging', {
      name: 'Create a Messaging Channel',
      members: ['dummy', 'jeroenleenartsgetstreamio'],
      // option to add custom fields
    });

    channel.create().then(response => {
      console.log(response);
    }).catch(err => {
      console.log(err);
    });

    // const {
    //   data: { user },
    // } = await supabase.auth.getUser()
  }, [])

  return (
    <Chat client={chatClient}>
      <ChannelList />
      <Channel>
        <Window>
          <ChannelHeader />
          <MessageList />
          <MessageInput />
        </Window>
        <Thread />
      </Channel>
    </Chat>
  )
}