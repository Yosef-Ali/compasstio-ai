"use client"
import { useRouter, usePathname, useParams } from 'next/navigation'
import { useMutation } from "convex/react"
import { toast } from "sonner"
import { api } from "@/convex/_generated/api"
import { PlusCircle } from 'lucide-react'
import React, { FC } from 'react'
import ItemButton from './item-button'
import { useUser } from "@clerk/clerk-react";
import { Id } from '@/convex/_generated/dataModel'
import TitleJournal from './top-nav/title-journals'
import TitleTasks from './top-nav/title-tasks'
import TitleChatWithAI from './top-nav/title-chat-with-ai'

import useCreateJournal from '@/app/hooks/useCreateJournal'
import useCreateTask from '@/app/hooks/useCreateTask'
import TitleChatWithGroups from './top-nav/title-chat-with-groups'
import TitleLiveSections from './top-nav/title-livesection'
interface Props {
  page?: "chat-with-ai" | "chat-with-groups" | "journals" | "tasks" | "live-sessions"
}

const TopNav: FC<Props> = ({ page }) => {
  const router = useRouter();
  const pathname = usePathname()

  const Pathname = pathname.split("/").slice(0, 2).join("/")

  console.log(Pathname);

  const { journalId } = useParams<{ journalId: Id<"journals"> }>();
  const { taskId } = useParams<{ taskId: Id<"tasks"> }>();
  const { groupId } = useParams<{ groupId: Id<"groups"> }>();
  const { createJournal } = useCreateJournal(journalId)
  const { createTask } = useCreateTask(taskId)

  const handleCreateJournal = () => {
    createJournal()
  }

  const handleCreateTask = () => {
    createTask()
  };

  const titleComponent = page === 'chat-with-ai' ? (
    <TitleChatWithAI journalId={journalId} />
  ) : page === 'chat-with-groups' ? (
    <TitleChatWithGroups groupId={groupId} />
  ) : page === 'journals' ? (
    <TitleJournal journalId={journalId} />
  ) : page === 'tasks' ? (
    <TitleTasks taskId={taskId} />
  ) : page === 'live-sessions' ? (
    <TitleLiveSections journalId={journalId} />
  ) : (
    null
  );


  const newButtonComponent = Pathname === '/journals' ? (
    <ItemButton
      onClick={handleCreateJournal}
      label="New Journal"
      icon={PlusCircle}
    />
  ) : Pathname === '/tasks' ? (
    <ItemButton
      onClick={handleCreateTask}
      label="New Task"
      icon={PlusCircle}
    />
  ) : Pathname === '/live-sessions' ? (
    <ItemButton
      onClick={() => { }}
      label="New Live Session"
      icon={PlusCircle}
    />
  ) : Pathname === '/chat-with-ai' ? (
    <ItemButton
      onClick={() => { }}
      label="New Chat"
      icon={PlusCircle}
    />
  ) : Pathname === '/chat-with-groups' ? (
    <ItemButton
      onClick={() => { }}
      label="New Chat"
      icon={PlusCircle}
    />
  ) : (
    null
  );

  return (
    <div className="sticky top-0 z-40 bg-background ">
      <div className="w-full">
        <div className=" pl-5 pr-5 py-3 md:pr-8 border-b  flex-1 flex  w-full">
          <div className="flex items-center w-full p-1">
            <div className="flex text-xl line-clamp-1">{titleComponent || "Untitled"}</div>
          </div>
          <div className="flex shrink-0">
            {newButtonComponent}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopNav