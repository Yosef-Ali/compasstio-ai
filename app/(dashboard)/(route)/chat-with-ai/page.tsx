"use client"


import CardPinnedChatBots from "../../_components/chat-with-ai/pinned-card";
import CardRecentChatBots from "../../_components/chat-with-ai/recent-card";

import { Footer } from "../../_components/footer";
import ChatbotContainer from "../../_components/new-chatbot-container";
import RightAside from "../../_components/right-aside";
import Shell from "../../_components/shell";
import TopNav from "../../_components/top-nav";
import Wrapper from "../../_components/wrapper";

const tabs = [
  {
    name: 'Recent',
    title: 'Recent',
    content: <CardRecentChatBots />

  },
  {
    name: 'Pinned',
    title: 'Pinned',
    content: <CardPinnedChatBots />
  }
];



const ChatWithAiPage = () => {

  return (
    <>
      <TopNav />

      <Shell>
        <Wrapper>
          {/* <ChatbotContainer /> */}
          <ChatbotContainer />
        </Wrapper>
        <RightAside tabs={tabs} />
      </Shell>
      <Footer />

    </>
  )
}
export default ChatWithAiPage


