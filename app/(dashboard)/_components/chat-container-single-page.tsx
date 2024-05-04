"use client";
import { useParams } from "next/navigation";
import { useState } from "react";
import { api } from "@/convex/_generated/api";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import GroupMessages from "./chat-with-group/groupe-messages";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import useWindowPositionAndMobile from "@/app/hooks/useWindowPositionAndMobile";
import { useSlideState } from "@/app/hooks/useSlideState";

const ChatContainerSinglePage = () => {
  const [inputValue, setInputValue] = useState("");
  const receiver_id = useParams().id as string;
  const { isMobile } = useWindowPositionAndMobile();
  const { isSlideOut } = useSlideState();

  const messages = receiver_id
    ? useQuery(api.messages.getMessages, { receiver_id })
    : undefined;

  const messageSent = useMutation(api.messages.create);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!inputValue) return;
    messageSent({
      receiver_id,
      content: inputValue,
    });
    setInputValue("");
  };

  if (messages === undefined) {
    return (
      <div className="mx-auto w-full max-w-lg py-24">
        <div className="space-y-10 pl-8 pt-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <Skeleton className="h-12 w-[50%]" />
            </div>
          ))}
          <Skeleton className="h-12 w-[80%]" />
        </div>
      </div>
    );
  }

  if (messages === null) {
    return <div>Not found</div>;
  }

  return (
    <div className="mx-auto w-full max-w-md pt-24 pb-8 md:pb-0 px-4 h-full flex flex-col">
      <div className="flex-grow overflow-auto">
        {messages.length > 0 ? (
          messages.map((m) => (
            <GroupMessages
              key={m._id}
              sender_id={m.sender_id}
              message={m.content}
            />
          ))
        ) : (
          <p className="text-center">No messages</p>
        )}
      </div>

      <form
        onSubmit={handleFormSubmit}
        className="flex items-center space-x-2 py-4 px-3 border"
      >
        <Input
          type="text"
          placeholder="Say something..."
          value={inputValue}
          onChange={handleInputChange}
        />
        <Button type="submit" className="text-white bg-purple-500 rounded-lg">
          Send
        </Button>
      </form>
    </div>
  );
};

export default ChatContainerSinglePage;