"use client"

import React, { useEffect } from 'react'
import TopNav from '../../../_components/top-nav'
import Shell from '../../../_components/shell'
import Wrapper from '../../../_components/wrapper'
import RightAside from '../../../_components/right-aside'
import Friends from '../../../_components/chat-with-group/chat-with-group'
import { useOnCreate } from "@/app/hooks/use-on-create";
import { useUser } from "@clerk/clerk-react";
import AllUsers from '../../../_components/chat-with-group/all-users'

interface ChatWithGroupPageProps {
  children: React.ReactNode
}

const tabs = [
  {
    name: 'Messages',
    title: 'Messages',
    content: <Friends />

  },
  {
    name: 'Invite Friends',
    title: 'Invite Friends',
    content: <AllUsers />
  }
];

const ChatWithGroupPage = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const { user } = useUser();
  const isOpen = useOnCreate((state) => state.isOpen);
  const toggleOpen = useOnCreate((state) => state.toggleOpen);

  useEffect(() => {
    useOnCreate.setState({ isOpen });
  }, [isOpen]);

  const onCreate = () => {
    toggleOpen(!isOpen);
  };
  return (
    <>
      <TopNav />
      <Shell>
        <Wrapper>
          {children}
        </Wrapper>
        <RightAside tabs={tabs} />
      </Shell>
    </>
  )
}

export default ChatWithGroupPage


