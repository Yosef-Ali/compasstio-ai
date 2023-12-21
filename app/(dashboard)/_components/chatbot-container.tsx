import React, { useState } from 'react';
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
    <div className="grid items-start ">
      {items.map((item, index) => {
        const Icon = Icons[item.icon || "arrowRight"];
        return (
          item.title && (
            <CardContent key={index} className="grid ">
              <div className=" flex items-center space-x-4 space-y-4 rounded-md  md:p-4">
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
    <div className="mx-auto flex flex-col items-center md:px-4 max-w-3xl">
      <div className="flex flex-col items-center space-y-4">
        <div className="flex flex-col items-start space-y-4 md:items-center">
          <h1 className="text-center md:text-left text-3xl font-bold text-purple-500">
            Welcome to Chat with AI
          </h1>
          <p className="text-center  text-sm text-purple-800 md:text-md md:w-[380px] ">
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

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/chat"
  });

  return (
    <Wrapper>
      <div className="mx-auto w-full max-w-md py-24 flex flex-col stretch space-y-10">
        {!inputFocused && <Intro />}
        <div className="space-y-4">
          {messages.map((m: Message) => (
            <ChatPromptResponse key={m.id} role={m.role} content={m.content} />
          ))}
        </div>
        <form onSubmit={handleSubmit} className="fixed bottom-6 w-full  sm:max-w-md max-w-xs">
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Say something..."
              value={input}
              onChange={handleInputChange}
              onFocus={() => setInputFocused(true)}
              className="w-full px-4 py-2 border rounded-lg"
            />
            <Button type="submit" className="px-4 py-2 text-white bg-purple-500 rounded-lg">Send</Button>
          </div>
        </form>
      </div>
    </Wrapper>
  );
};

export default ChatbotContainer;

