"use client"
import { useRef, useState } from "react";
import { ChatInfo } from "@/types";
import { Icons } from "@/components/icons";
import { CardContent } from "@/components/ui/card";
import { messageInfoConfig } from "@/config/chat-info";
import { Avatar } from "@/components/ui/avatar";
import RightAside from "./right-aside";
import AllUsers from "./chat-with-group/all-users";
import Friends from "./chat-with-group/chat-with-group";
import { useSlideState } from "@/app/hooks/useSlideState";
import useWindowPositionAndMobile from "@/app/hooks/useWindowPositionAndMobile";
import { useSlideStateMobile } from "@/app/hooks/useSlideStateMobile";


interface InfoListProps {
  items: ChatInfo[];
}



const InfoList = ({ items }: InfoListProps) => {
  if (!items?.length) {
    return null;
  }

  return (

    <div className="grid items-start">
      {items.map((item, index) => {
        const Icon = Icons[item.icon || "arrowRight"];
        return (
          item.title && (
            <div className="grid" key={index}>
              <div className=" flex items-center space-x-4 space-y-4  rounded-md  md:p-4">
                <Avatar className="bg-purple-100 flex justify-center items-center">
                  <Icon className="h-6 w-6 text-purple-500" />
                </Avatar>
                <div className="flex-1 space-y-1">
                  <h3 className="font-bold text-left">{item.title}</h3>
                  <p className="text-sm text-muted-foreground text-left">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          )
        );
      })}
    </div>
  );
};

const Intro = () => {
  return (
    <div className="mx-auto w-full z-0 max-w-sm md:max-w-md lg:max-w-lg px-4  py-12 lg:py-24 flex flex-col stretch space-y-10 text-center transition-width duration-500">
      <div className="flex flex-col items-center space-y-4">
        <div className="flex  items-start space-y-4 md:items-center">
          <h1 className="text-3xl font-bold text-purple-500 text-center">
            Welcome to Messaging
          </h1>
        </div>
        <InfoList items={messageInfoConfig} />
      </div>
    </div>
  );
};

const ChatContainer = () => {

  return (
    <>
      <Intro />
    </>
  );
};

export default ChatContainer;

