"use client";

import { useChat } from "ai/react";
import { useEffect, useRef } from "react";
import Textarea from "react-textarea-autosize";
import { UserButton } from "@clerk/clerk-react";
import Wrapper from "./wrapper";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ChatbotContainer() {
  // const { messages, input, handleInputChange, handleSubmit } = useChat({
  //   api: "/api",
  // });
  const { messages, input, handleInputChange, handleSubmit } = useChat()

  const messageEndRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();

  }, [messages]);

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSubmit(event);
  };


  return (
    <Wrapper>
      <div className="mx-auto w-full max-w-2xl py-24 flex flex-col stretch space-y-10 ">

        {messages.length !== 0 ? (
          <div className="pb-32 pt-5 space-y-5 w-[75%] mx-auto ">
            {messages.map((message) => (
              <div key={message.id} className="w-full">
                {message.role === "user" ? (
                  <div className="flex items-end  mb-4 w-full ">
                    <div className="flex items-start">
                      <UserButton
                        afterSignOutUrl="/"
                      />
                      <div className="px-3 py-2 ml-3 rounded-lg rounded-l-none inline-block bg-muted">
                        {message.content}
                      </div>

                    </div>
                  </div>
                ) : (
                  <div className="flex items-start">

                    <Avatar>
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>YA</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start ml-3 ">
                      <div className="px-3 py-2 rounded-lg inline-block bg-muted/30 rounded-l-none ">
                        {message.content}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full flex justify-center pt-32">
            <h1 className="font-bold text-3xl">
              Please use the input filed below ⬇️
            </h1>
          </div>
        )}

        <div ref={messageEndRef}></div>

        <form
          onSubmit={handleFormSubmit}
          className="p-5 fixed bottom-0 w-full max-w-2xl mx-auto"
        >
          <div className="relative flex items-center">
            <Textarea
              tabIndex={0}
              required
              rows={1}
              value={input}
              onChange={handleInputChange}
              autoFocus
              placeholder="Send message..."
              spellCheck={false}
              className="w-full focus:outline-none shadow-xl placeholder:text-gray-300 text-sm  p-5 pr-16 rounded-xl bg-muted "
            />
            <button
              type="submit"
              className="absolute bg-purple-400 p-2 rounded-lg right-0 mr-5"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 text-white"
              >
                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </Wrapper>
  );

}