"use client"
import { useChat } from "ai/react";
import ChatContainer from "../../_components/chat-container";
import CardPinnedChatBots from "../../_components/chat-with-ai/pinned-card";
import CardRecentChatBots from "../../_components/chat-with-ai/recent-card";
import ChatbotContainer from "../../_components/chatbot-container";
import { Footer } from "../../_components/footer";
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
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <>
      <TopNav />

      <Shell>
        <Wrapper>

          <ChatbotContainer messages={messages} />
        </Wrapper>
        <RightAside tabs={tabs} />
      </Shell>
      <Footer input={input} handleInputChange={handleInputChange} />

    </>
  )
}
export default ChatWithAiPage


