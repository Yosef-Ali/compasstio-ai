"use client"

import React, { useEffect } from 'react'
import TopNav from '../../_components/top-nav'
import Shell from '../../_components/shell'
import Wrapper from '../../_components/wrapper'
import { Button } from '@/components/ui/button'
import { PlusCircleIcon } from 'lucide-react'
import RightAside from '../../_components/right-aside'
import ChatWithGroup from '../../_components/chat-with-group/chat-with-group'
import { useOnCreate } from "@/app/hooks/use-on-create";
import { useUser } from "@clerk/clerk-react";
import ChatContainer from '../../_components/chat-container'
import AllUsers from '../../_components/chat-with-group/all-users'

interface ChatWithGroupPageProps {
  children: React.ReactNode
}

const tabs = [
  {
    name: 'Messages',
    title: 'Messages',
    content: <ChatWithGroup />

  },
  {
    name: 'Invite Friends',
    title: 'Invite Friends',
    content: <AllUsers />
  }
];

const ProfilePageLayout = ({
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
        {/* <ChatContainer /> */}
        {children}
      </Wrapper>
      <RightAside tabs={tabs} />
    </Shell>
  </>
  )
}

export default ProfilePageLayout


