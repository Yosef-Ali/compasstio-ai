"use client"
import { ChatInfo } from "@/types";
import { Icons } from "@/components/icons";
import { CardContent } from "@/components/ui/card";
import { chatInfoConfig } from "@/config/chat-info";
import { Avatar } from "@/components/ui/avatar";
import ChatInput from "./chat-input";
import Wrapper from "./wrapper";
import ChatPromptResponse from "./chat-with-group/response";

import { api } from "@/convex/_generated/api";
import { useConvexAuth, useQuery } from "convex/react";
import { ChatCard } from "./chat-with-ai/chat-card";
import { Id } from "@/convex/_generated/dataModel";
import { useCompletion } from 'ai/react';
import { useUser } from "@clerk/clerk-react";
import { useParams } from "next/navigation";




const ChatContainerSinglePage = () => {
  // const chatbots = useQuery(api.chatbots.get) as Chatbot[]

  const sender = useUser()
  const receiver = useParams()._id

  console.log("sender:", sender)
  console.log("receiver:", receiver)

  // const saveMessages = useMutation(app.chatMessages.create){


  // }




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
      {/* {chatbots?.map(chatbot => {
        return (
          <ChatPromptResponse key={chatbot._id} prompt={chatbot.description ?? " "}
            response={chatbot.description ?? " "} />
        );
      })} */}
    </Wrapper>
  );
};

export default ChatContainerSinglePage;

