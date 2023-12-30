"use client"
import React, { useEffect, useRef, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserButton } from "@clerk/clerk-react";
import { useUser } from '@clerk/nextjs';
import { useParams } from 'next/navigation';
import { Id } from '@/convex/_generated/dataModel';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

interface Props {
  sender_id: string
  message: string
}

export default function GroupMessages({ sender_id, message }: Props) {


  const { user } = useUser();
  const receiver_id = useParams().id as string;

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const senderInfo = useQuery(api.users.getFriend, { id: sender_id })
  const receiverInfo = useQuery(api.users.getFriend, { id: receiver_id })


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }


  useEffect(() => {
    scrollToBottom();
  }, [message]);


  return (
    <div className="flex flex-col mx-auto  w-full space-y-8 py-8 ">
      {sender_id === user?.id && (
        <div className="flex justify-end mb-4 w-full ">
          <div className="flex  items-end">

            <div className="px-3 py-2  rounded-lg rounded-r-none inline-block bg-muted">
              {message}
            </div>
            <Avatar className="ml-3">
              <AvatarImage src={senderInfo?.avatarUrl || user?.imageUrl} />
              <AvatarFallback>YA</AvatarFallback>
            </Avatar>
          </div>
        </div>

      ) || sender_id !== user?.id && (
        <div className="flex items-start">
          <Avatar>
            <AvatarImage src={receiverInfo?.avatarUrl} />
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