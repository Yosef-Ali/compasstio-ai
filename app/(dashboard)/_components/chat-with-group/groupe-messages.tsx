"use client"
import React, { useEffect, useRef, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserButton } from "@clerk/clerk-react";
import { useUser } from '@clerk/nextjs';
import { useParams } from 'next/navigation';

interface Props {
  sender_id: string
  recipient_id: string
  message: string
}

export default function GroupMessages({ sender_id, recipient_id, message }: Props) {

  const groupId = useParams().groupId

  const { user } = useUser();

  const messagesEndRef = useRef<HTMLDivElement>(null);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }


  useEffect(() => {
    scrollToBottom();
  }, [message]);


  return (
    <div className="flex flex-col mx-auto  w-full space-y-10 ">
      {sender_id === user?.id && (
        <div className="flex items-end  mb-4 w-full ">
          <div className="flex items-start">
            <UserButton />
            <div className="px-3 py-2 ml-3 rounded-lg rounded-l-none inline-block bg-muted">
              {message}
            </div>

          </div>
        </div>

      ) || sender_id !== user?.id && (
        <div className="flex items-start">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>YA</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start ml-3 ">
            <div className="px-3 py-2 rounded-lg inline-block bg-muted/30 rounded-l-none ">
              {message}
            </div>
          </div>
        </div>
      )
      }
      <div ref={messagesEndRef} />
    </div >
  )
}