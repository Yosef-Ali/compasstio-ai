"use client"
import { useRef, useState } from "react";
import { ChatInfo } from "@/types";
import { Icons } from "@/components/icons";
import { CardContent } from "@/components/ui/card";
import { messageInfoConfig } from "@/config/chat-info";
import { Avatar } from "@/components/ui/avatar";
import Wrapper from "./wrapper";

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
        const Icon = Icons[item.icon || "arrowRight"];
        return (
          item.title && (
            <CardContent className="grid" key={index}>
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
    <div className="mx-auto w-full max-w-lg py-24 flex flex-col stretch space-y-10 ">
      <div className="flex flex-col items-center space-y-4">
        <div className="flex flex-col items-start space-y-4 md:items-center">
          <h1 className="text-3xl font-bold text-purple-500">
            Welcome to Messagingdd
          </h1>
        </div>
        <InfoList items={messageInfoConfig} />
      </div>
    </div>
  );
};

const ChatContainer = () => {
  return (
    <Wrapper>
      <Intro />
    </Wrapper>
  );
};

export default ChatContainer;

