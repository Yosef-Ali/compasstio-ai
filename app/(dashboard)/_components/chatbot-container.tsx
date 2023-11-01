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
import { useChat } from 'ai/react';
import { useMutation, useQuery } from "convex/react";
import { ChatCard } from "./chat-with-ai/chat-card";
import { Id } from "@/convex/_generated/dataModel";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface InfoListProps {
  items: ChatInfo[];
}



const InfoList = ({ items }: InfoListProps) => {
  if (!items?.length) {
    return null;
  }

  return (
    <div className="grid items-start ">
      {items.map((item, index) => {
        console.log('item.icon', item.icon)
        const Icon = Icons[item.icon || "arrowRight"];
        return (
          item.title && (
            <CardContent className="grid ">
              <div className=" flex items-center space-x-4 rounded-md  p-4">
                <Avatar className="bg-purple-100 flex justify-center items-center">
                  <Icon className="h-6 w-6 text-purple-500" />
                </Avatar>
                <div className="flex-1 space-y-1">
                  <h3 className="font-bold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">
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

    <div className="mx-auto flex flex-col items-center px-4 max-w-3xl">
      <div className="flex flex-col items-center space-y-4">
        <div className="flex flex-col items-start space-y-4 md:items-center">
          <h1 className="text-3xl font-bold text-purple-500">
            Welcome to Chat with AI
          </h1>
          <p className="text-sm text-purple-800 md:text-md md:w-[380px] md:text-center">
            Get started by writing a task and Chat can do the rest. Not sure where to start? Check out the Prompt Library for inspiration.
          </p>
        </div>
        <InfoList items={chatInfoConfig} />
      </div>
    </div>
  );
};



const ChatbotContainer = () => {

  const { messages, input, handleInputChange, handleSubmit } = useChat();
  const saveMessagesMutation = useMutation(api.messages.create);

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    // event.preventDefault();
    // handleSubmit(); // Assuming handleSubmit is an async function
    // saveMessagesMutation.mutate({
    //   role: 'user',
    //   content: input
    // })
    { }
  };



  return (
    <Wrapper>
      <div className="mx-auto w-full max-w-lg py-24 flex flex-col stretch space-y-10  ">
        {messages.map(m => (
          <ChatPromptResponse key={m.id} role={m.role} content={m.content} />
        ))}
        <form onSubmit={handleSubmit} >
          <div className="flex w-full max-w-md items-center space-x-2 fixed bottom-6 ">
            <Input type="text" placeholder="Say something..." value={input} onChange={handleInputChange} className=" ring-offset-purple-300 focus-visible:ring-purple-400 " />
            <Button type="submit" className="bg-purple-400">Send</Button>
          </div>
        </form>
      </div>
    </Wrapper>
  );
};

export default ChatbotContainer;

