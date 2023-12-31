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
import { useConvexAuth, useMutation, useQuery } from "convex/react";

import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/clerk-react";
import { useParams } from "next/navigation";
import { useChat, useCompletion } from 'ai/react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import GroupMessages from "./chat-with-group/groupe-messages";
import { Skeleton } from "@/components/ui/skeleton";
import useWindowPositionAndMobile from "@/app/hooks/useWindowPositionAndMobile";
import { useSlideState } from "@/app/hooks/useSlideState";
import { ScrollArea } from "@/components/ui/scroll-area";





const ChatContainerSinglePage = () => {

  const [inputValue, setInputValue] = useState("");

  const receiver_id = useParams().id as string;
  const { isMobile } = useWindowPositionAndMobile();
  const { isSlideOut } = useSlideState(); // Initialize isSlideOut to false



  const messages = receiver_id ? useQuery(api.messages.getMessages, { receiver_id: receiver_id }) : undefined

  const messageSent = useMutation(api.messages.create)

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!inputValue) return;
    messageSent({
      receiver_id: receiver_id,
      content: inputValue
    })
    setInputValue(""); // Clear input value after submission
  };

  if (messages === undefined) {
    return (
      <div>
        <div className="mx-auto w-full max-w-lg py-24 ">
          <div className="space-y-10  pl-8 pt-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <Skeleton className="h-12 w-[50%]" />
            </div>
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <Skeleton className="h-12 w-[50%]" />
            </div>
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <Skeleton className="h-12 w-[50%]" />
            </div>
            <Skeleton className="h-12 w-[80%]" />
          </div>
        </div>
      </div>
    );
  }

  if (messages === null) {
    return <div>Not found</div>
  }


  return (


    <div className="mx-auto w-full max-w-md py-24 h-full flex-col stretch space-y-10 text-center ">

      {messages ? messages.map(m => {
        return (
          <GroupMessages key={m._id} sender_id={m.sender_id} message={m.content} />
        )
      })
        : (<p className="text-center">No messages</p>)
      }

      <form onSubmit={handleFormSubmit} className={`${isMobile && !isSlideOut || !isMobile ? 'fixed ' : 'hidden'} bottom-14 md:bottom-6 w-full max-w-sm sm:max-w-md lg:max-w-sm xl:max-w-lg`}>
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Say something..."
            value={inputValue}
            onChange={handleInputChange}
            className="ring-offset-purple-300 focus-visible:ring-purple-400"
          />
          <Button type="submit" className="px-4 py-2 text-white bg-purple-500 rounded-l">
            Send
          </Button>
        </div>
      </form>

    </div>

  );
};


export default ChatContainerSinglePage;

