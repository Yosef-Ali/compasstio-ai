"use client"

import { ChatInfo } from "@/types";
import { Icons } from "@/components/icons";
import { messageInfoConfig } from "@/config/chat-info";
import { Avatar } from "@/components/ui/avatar";

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
    <div className="mx-auto w-full z-0 max-w-sm md:max-w-md  px-4  py-12 lg:py-24 flex flex-col stretch space-y-10 text-center transition-width duration-500">
      <div className="flex flex-col items-center space-y-4">
        <div className="flex flex-col items-start space-y-4 md:items-center">
          <h1 className="text-center md:text-left text-3xl font-bold text-purple-500">
            Welcome to Messaging
          </h1>
          <p className="text-center text-sm text-purple-800 md:text-md ">
            Create your group of like-minded friends to support and uplift one another.
          </p>
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

