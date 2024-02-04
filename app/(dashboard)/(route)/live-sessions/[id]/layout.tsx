"use client"

import React, { useEffect } from 'react'
import TopNav from '../../../_components/top-nav'
import Shell from '../../../_components/shell'
import Wrapper from '../../../_components/wrapper'
import RightAside from '../../../_components/right-aside'
import ParticipantListPage from '@/app/(dashboard)/_components/live-streaming/ParticipantListSinglePage'
import MeetingList from '@/app/(dashboard)/_components/live-streaming/MeetingList'

interface ChatWithGroupPageProps {
  children: React.ReactNode
}

const tabs = [
  {
    name: 'Participant ',
    title: 'Participant',
    content: <ParticipantListPage />
  },
  {
    name: 'Meetings',
    title: 'Meetings',
    content: <MeetingList />
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


