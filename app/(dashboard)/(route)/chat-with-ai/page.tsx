"use client"

import CardPinnedChatBots from "../../_components/chat-with-ai/pinned-card";
import CardRecentChatBots from "../../_components/chat-with-ai/recent-card";

import { Footer } from "../../_components/footer";
import ChatbotContainer from "../../_components/chatbot-container";
import RightAside from "../../_components/right-aside";
import Shell from "../../_components/shell";
import TopNav from "../../_components/top-nav";
import Wrapper from "../../_components/wrapper";
import { useConvexAuth, useQuery } from "convex/react";
import { Spinner } from "@/components/spinner";
import { useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";

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

  const { isLoading } = useConvexAuth()

  const { user } = useUser();



  if (!user) return null;

  const userInfo = useQuery(api.users.getUser, { userId: user.id });

  console.log('userInfoOnChatWithAi', userInfo)


  if (!isLoading && userInfo?.userId !== user.id) {
    return (<div className="w-full flex items-center justify-center">
      <Spinner size="lg" />
    </div>)
  }


  return (
    <>
      <TopNav />

      <Shell>
        <Wrapper>
          <ChatbotContainer />
        </Wrapper>
        <RightAside tabs={tabs} />
      </Shell>
      <Footer />

    </>
  )
}
export default ChatWithAiPage


