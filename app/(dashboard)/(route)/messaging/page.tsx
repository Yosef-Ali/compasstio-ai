
"use client"

import RightAside from '../../_components/right-aside'
import ChatContainer from '../../_components/chat-with-group-container'
import AllUsers from '../../_components/chat-with-group/all-users'
import TopNav from '../../_components/top-nav'
import Wrapper from '../../_components/wrapper'
import Shell from "../../_components/shell"
import Friends from '../../_components/chat-with-group/chat-with-group'


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




