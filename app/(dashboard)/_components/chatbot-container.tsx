"use client"
import React, { useEffect, useState } from 'react';
import { ChatInfo } from "@/types";
import { Icons } from "@/components/icons";
import { CardContent } from "@/components/ui/card";
import { chatInfoConfig } from "@/config/chat-info";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ChatPromptResponse from "./chat-with-ai/chat-messages";
import { useChat } from 'ai/react';
import Wrapper from "./wrapper";
import { useSlideState } from '@/app/hooks/useSlideState';
import { useSlideStateMobile } from '@/app/hooks/useSlideStateMobile';
import useWindowPositionAndMobile from '@/app/hooks/useWindowPositionAndMobile';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Console } from 'console';

interface InfoListProps {
  items: ChatInfo[];
}

interface Message {
  id: string;
  role: string;
  content: string;
}

interface UseChatHelpers {
  messages: Message[];
  input: string;
  handleSubmit: () => void;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFinish?: (message: Message) => void;
}

interface ExtendedUseChatHelpers extends UseChatHelpers {
  initialInput: string;
}


const InfoList = ({ items }: InfoListProps) => {
  if (!items?.length) {
    return null;
  }

  return (
    <div>
      {items.map((item, index) => {
        const Icon = Icons[item.icon || "arrowRight"];
        return (
          item.title && (
            <CardContent key={index} >
              <div className=" flex items-center space-x-4 space-y-4 rounded-md  md:p-4">
                <Avatar className="bg-purple-100 flex justify-center items-center">
                  <Icon className="h-6 w-6 text-purple-500" />
                </Avatar>
                <div className="flex-1 space-y-1 ">
                  <h3 className="font-bold text-left">{item.title}</h3>
                  <p className="text-sm text-muted-foreground text-left ">
                    {item.description}
                  </p>
                </div>
              </div>
            </CardContent>
          )
        );
      })}
    </div>
  );
};


const Intro = () => {
  return (
    <div className="mx-auto flex flex-col items-center md:px-4">
      <div className="flex flex-col items-center space-y-4">
        <div className="flex flex-col items-start space-y-4 md:items-center">
          <h1 className="text-center md:text-left text-3xl font-bold text-purple-500">
            Welcome to Chat with AI
          </h1>
          <p className="text-center text-sm text-purple-800 md:text-md ">
            Get started by writing a task and Chat can do the rest. Not sure where to start? Check out the Prompt Library for inspiration.
          </p>
        </div>
        <InfoList items={chatInfoConfig} />
      </div>
    </div>
  );
};

const ChatbotContainer: React.FC = () => {
  const [inputFocused, setInputFocused] = useState<boolean>(false);
  const { isMobile } = useWindowPositionAndMobile();
  const { isSlideOut } = useSlideState();

  const freeTrail = useQuery(api.users.getEndsOn, {});
  const [isBlocked, setIsBlocked] = useState<boolean>(false);



  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/chat"
  });

  const subscriptionEnds = freeTrail?.endsOn ? freeTrail.endsOn < Date.now() / 1000 : false;

  useEffect(() => {
    if (freeTrail) {
      if (!freeTrail?.success) {
        setIsBlocked(true);
      }
    }

  }, [freeTrail])


  //console.log("isBlocked", isBlocked)

  return (
    <>
      <div className="mx-auto w-full z-0 max-w-sm md:max-w-md lg:max-w-lg px-4 py-12 lg:py-24 flex flex-col space-y-10 text-center transition-width duration-500">
        {!inputFocused && <Intro />}
        <ScrollArea className="h-[82vh] w-full">
          <div className="space-y-4">
            {isBlocked ? (subscriptionEnds ?

              <div>
                Your subscription has expired.{" "}
                <span className="text-purple-500 font-semibold">
                  Upgrade to Pro for unlimited chats.
                </span>
              </div> :

              <div>
                You have reached the chat limit for unsubscribed users (14 days).{" "}
                <span className="text-purple-500 font-semibold">
                  Upgrade to Pro for unlimited chats.
                </span>
              </div>
            )
              :
              (
                messages.map((m: Message) => (
                  <ChatPromptResponse
                    key={m.id}
                    role={m.role}
                    content={m.content}
                  />
                ))
              )}
          </div>
          {!isBlocked && (
            <form
              onSubmit={handleSubmit}
              className={`${isMobile && !isSlideOut || !isMobile ? "fixed" : "hidden"
                } bottom-14 md:bottom-6 w-full max-w-sm sm:max-w-md lg:max-w-sm xl:max-w-lg`}
            >
              <div className="flex items-center space-x-2">
                <Input
                  type="text"
                  placeholder="Say something..."
                  value={input}
                  onChange={handleInputChange}
                  onFocus={() => setInputFocused(true)}
                  className="w-full px-4 py-2 border rounded-lg"
                />
                <Button
                  type="submit"
                  className="px-4 py-2 text-white bg-purple-500 rounded-lg "
                >
                  Send
                </Button>
              </div>
            </form>
          )}
        </ScrollArea>
      </div>
    </>
  );
};

export default ChatbotContainer;

