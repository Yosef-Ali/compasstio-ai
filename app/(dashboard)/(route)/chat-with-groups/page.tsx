
"use client"

import React, { useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { PlusCircleIcon } from 'lucide-react'
import RightAside from '../../_components/right-aside'

import { useOnCreate } from "@/app/hooks/use-on-create";
import { useUser } from "@clerk/clerk-react";
import ChatContainer from '../../_components/chat-container'
import AllUsers from '../../_components/chat-with-group/all-users'

import ChatContainerSinglePage from "@/app/(dashboard)/_components/chat-container-single-page"
import TopNav from '../../_components/top-nav'
import Wrapper from '../../_components/wrapper'
import Shell from '../../_components/shell'
import Friends from '../../_components/chat-with-group/chat-with-group'

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


const ChatWithGroupSinglePage = () => {

  return (
    <>
      <TopNav />
      <Shell>
        <Wrapper>
          <ChatContainer />
        </Wrapper>
        <RightAside tabs={tabs} />
      </Shell>
    </>
  )
}

export default ChatWithGroupSinglePage




