"use client"

import React, { useEffect } from 'react'
import TopNav from '../../../_components/top-nav'
import Shell from '../../../_components/shell'
import Wrapper from '../../../_components/wrapper'
import RightAside from '../../../_components/right-aside'
import Friends from '../../../_components/chat-with-group/messaging-with-friends'
import { useOnCreate } from "@/app/hooks/use-on-create";
import { useUser } from "@clerk/clerk-react";
import AllUsers from '../../../_components/chat-with-group/all-users'
import ParticipantList from '@/app/(dashboard)/_components/live-streaming/ParticipantList'

interface ChatWithGroupPageProps {
  children: React.ReactNode
}

const tabs = [
  {
    name: 'Participant ',
    title: 'Participant',
    content: <ParticipantList />
  },
  {
    name: 'Setting',
    title: 'Setting',
    content: <ParticipantList />
  }
];

const LiveStreamingPage = ({
  children
}: {
  children: React.ReactNode;
}) => {

  return (
    <>
      <TopNav />
      <Shell>
        <Wrapper>
          <div className='w-full bg-gray-800 h-full'>
            {children}
          </div>
        </Wrapper>
        <RightAside tabs={tabs} />
      </Shell>
    </>
  )
}

export default LiveStreamingPage


