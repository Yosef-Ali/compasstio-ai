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

  console.log("I am a single page")


  return (
    <>

      <ChatContainerSinglePage />
    </>
  )
}

export default ChatWithGroupSinglePage


