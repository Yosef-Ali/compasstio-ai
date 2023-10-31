"use client"
import React, { useEffect, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserButton } from "@clerk/clerk-react";

interface Props {
  role: string
  content: string
}

export default function ChatPromptResponse({ role, content }: Props) {

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(scrollToBottom, [content]);


  return (
    <div className="flex flex-col mx-auto  w-full space-y-10">
      {role === "user" ?
        <div className="flex items-end  mb-4 w-full ">
          <div className="flex items-start">
            <UserButton />
            <div className="px-3 py-2 ml-3 rounded-lg rounded-l-none inline-block bg-muted">
              {content}
            </div>

          </div>
        </div>
        :
        <div className="flex items-start">

          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>YA</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start ml-3 ">
            <div className="px-3 py-2 rounded-lg inline-block bg-muted/30 rounded-l-none ">
              {content}
            </div>
          </div>

          <div ref={messagesEndRef} />
        </div>
      }

    </div >
  )
}