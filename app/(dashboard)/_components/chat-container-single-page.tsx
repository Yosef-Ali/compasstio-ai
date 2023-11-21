"use client"
import { ChatInfo } from "@/types";
import { Icons } from "@/components/icons";
import { CardContent } from "@/components/ui/card";
import { chatInfoConfig } from "@/config/chat-info";
import { Avatar } from "@/components/ui/avatar";
import ChatInput from "./chat-input";
import Wrapper from "./wrapper";
import ChatPromptResponse from "./chat-with-ai/chat-messages";

import { api } from "@/convex/_generated/api";
import { useConvexAuth, useQuery } from "convex/react";
import { ChatCard } from "./chat-with-ai/chat-card";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/clerk-react";
import { useParams } from "next/navigation";
import { useChat, useCompletion } from 'ai/react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface InfoListProps {
  items: ChatInfo[];
}


const ChatContainerSinglePage = () => {
  //const chatbots = useQuery(api.chatbots.get)

  //const sender = useUser()
  const receiver = useParams().userId

  //console.log("sender:", sender)
  console.log("receiver:", receiver)

  // const saveMessages = useMutation(app.chatMessages.create){


  // }
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  const { completion } = useCompletion();

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSubmit(event); // Assuming handleSubmit is an async function
    console.log('completion:::', messages)
  };



  //const { isLoading } = useConvexAuth()

  // if (chatbots === undefined || isLoading) {
  //   return (
  //     <div className="space-y-3">
  //       <ChatCard.Skeleton />
  //       <ChatCard.Skeleton />
  //       <ChatCard.Skeleton />
  //     </div>
  //   );
  // };
  return (

    <Wrapper>
      <div className="mx-auto w-full max-w-lg py-24 flex flex-col stretch space-y-10  ">
        {messages.map(m => (
          <ChatPromptResponse key={m.id} role={m.role} content={m.content} />
        ))}
        <form onSubmit={handleFormSubmit} >
          <div className="flex w-full max-w-md items-center space-x-2 fixed bottom-6 ">
            <Input type="text" placeholder="Say something..." value={input} onChange={handleInputChange} className=" ring-offset-purple-300 focus-visible:ring-purple-400 " />
            <Button type="submit" className="bg-purple-400">Send</Button>
          </div>
        </form>
      </div>
    </Wrapper>


  );
};

export default ChatContainerSinglePage;

