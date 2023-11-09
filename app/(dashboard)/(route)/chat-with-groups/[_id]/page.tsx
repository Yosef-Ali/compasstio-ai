"use client"

import ChatContainerSinglePage from "@/app/(dashboard)/_components/chat-container-single-page"
import { Id } from "@/convex/_generated/dataModel";

interface UserIdPageProps {
  params: {
    userId: Id<"users">;
  };
};


const ChatWithGroupSinglePage = ({ params }: { params: { userId: string } }) => {

  const param_Id = params.userId


  return (
    <>
      <ChatContainerSinglePage userId={param_Id} />
    </>
  )
}

export default ChatWithGroupSinglePage


