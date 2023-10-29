"use client"

import React from 'react'
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

const page = () => {
  return (<>
    <TopNav />
    <Shell>
      <Wrapper>
        <h2 className="text-lg font-medium">
          {/* Welcome to {user?.fullName}&apos;s Jotion */}
        </h2>
        {/* <Button onClick={onCreate}>
          <PlusCircleIcon className="h-4 w-4 mr-2" />
          Create a note
        </Button> */}
      </Wrapper>
      <RightAside tabs={tabs} />
    </Shell>
  </>
  )
}

export default page


