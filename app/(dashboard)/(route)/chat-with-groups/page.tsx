"use client"

import React, { useEffect } from 'react'
import TopNav from '../../_components/top-nav'
import Shell from '../../_components/shell'
import Wrapper from '../../_components/wrapper'
import { Button } from '@/components/ui/button'
import { PlusCircleIcon } from 'lucide-react'
import RightAside from '../../_components/right-aside'
import CardChatWithGroup from '../../_components/chat-with-group/chat-with-group'
import CardChatWithAll from '../../_components/chat-with-group/chat-with-all'
import ChatWithGroup from '../../_components/chat-with-group/chat-with-group'
import ChatWithAll from '../../_components/chat-with-group/chat-with-all'
import WelcomeMessage from '@/components/welcome-message'
import { useOnCreate } from "@/app/hooks/use-on-create";
import { useUser } from "@clerk/clerk-react";
import ChatContainer from '../../_components/chat-container'

const tabs = [
  {
    name: 'Messages',
    title: 'Messages',
    // content: <CardRecent />
    content: <ChatWithGroup />

  },
  {
    name: 'Invite Friends',
    title: 'Invite Friends',
    content: <ChatWithAll />
  }
];

const ChatWithGroupPage = () => {
  const { user } = useUser();
  const isOpen = useOnCreate((state) => state.isOpen);
  const toggleOpen = useOnCreate((state) => state.toggleOpen);

  useEffect(() => {
    useOnCreate.setState({ isOpen });
  }, [isOpen]);

  const onCreate = () => {
    toggleOpen(!isOpen);
  };
  return (<>
    <TopNav />
    <Shell>
      <Wrapper>
        {/* {!isOpen ?
          <WelcomeMessage
            userFullName={user?.fullName}
            onCreate={onCreate}
            buttonLabel="Chat with group"
          />
          : <ChatContainer />} */}
        <ChatContainer />
      </Wrapper>
      <RightAside tabs={tabs} />
    </Shell>
  </>
  )
}

export default ChatWithGroupPage


