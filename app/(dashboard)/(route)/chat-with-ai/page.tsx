"use client"
import ChatContainer from "../../_components/chat-container";
import CardPinned from "../../_components/chat-with-ai/pinned-card";
import CardRecent from "../../_components/chat-with-ai/recent-card";
import { Footer } from "../../_components/footer";
import CardRecentJournal from "../../_components/journals/card-journal-recent";
import RightAside from "../../_components/right-aside";
import Shell from "../../_components/shell";
import TopNav from "../../_components/top-nav";
import Wrapper from "../../_components/wrapper";

const tabs = [
  {
    name: 'Recent',
    title: 'Recent',
    // content: <CardRecent />
    content: <CardRecentJournal />

  },
  {
    name: 'Pinned',
    title: 'Pinned',
    content: <CardPinned />
  }
];

const ChatWithAiPage = () => {
  return (
    <>
      <TopNav />

      <Shell>
        <Wrapper>
          <ChatContainer />
        </Wrapper>
        <RightAside tabs={tabs} />
      </Shell>
      <Footer />

    </>
  )
}
export default ChatWithAiPage


