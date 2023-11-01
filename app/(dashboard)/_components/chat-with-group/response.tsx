"use client"
import React, { useEffect, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserButton } from "@clerk/clerk-react";

interface Props {
  prompt: string
  response: string
}

export default function ChatPromptResponse({ prompt, response }: Props) {

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(scrollToBottom, [response]);


  return (
    <div className="flex flex-col mx-auto max-w-xl w-full space-y-2 mb-10">
      <div className="flex items-end  mb-4 w-full max-w-xl">
        <div className="flex items-start">
          <UserButton />
          <div className="px-3 py-2 ml-3 rounded-lg rounded-l-none inline-block bg-muted">
            {prompt}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <div className="flex flex-col  mr-3 ">
          <div className="px-3 py-2 rounded-lg inline-block bg-muted/30 rounded-l-none ">
            {response}
          </div>
        </div>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>YA</AvatarFallback>
        </Avatar>
        <div ref={messagesEndRef} />
      </div>

    </div >
  )
}