"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Icons } from "@/components/icons"

import { Id } from "@/convex/_generated/dataModel"
import useDeleteJournal from "@/app/hooks/useDeleteJournal"
import useDeleteTasks from "@/app/hooks/ useDeleteTask"

interface PostProps {
  id: string;
  identity: string;
}


export function JournalOperationsMenu({ id }: PostProps) {
  const { deleteJournal } = useDeleteJournal(id as Id<"journals">);
  const handleDelete = () => {
    deleteJournal();
  }

  return (
    <>
      <DropdownMenu>
        {/* Dropdown menu content */}
        <DropdownMenuItem
          className="flex cursor-pointer items-center text-destructive focus:text-destructive"
          onSelect={handleDelete}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenu>
    </>
  )
}

export function TaskOperationsMenu({ id }: PostProps) {
  const { deleteTask } = useDeleteTasks(id as Id<"tasks">);
  const handleDelete = () => {
    deleteTask();
  }

  return (
    <>
      <DropdownMenu>
        {/* Dropdown menu content */}
        <DropdownMenuItem
          className="flex cursor-pointer items-center text-destructive focus:text-destructive"
          onSelect={handleDelete}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenu>
    </>
  )
}

export function OperationsMenu({ id, identity }: PostProps) {
  const router = useRouter();
  const params = useParams();
  const [journalHook, setJournalHook] = React.useState(null);
  const [taskHook, setTaskHook] = React.useState(null);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md border transition-colors hover:bg-muted">
          <Icons.ellipsis className="h-4 w-4" />
          <span className="sr-only">Open</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Link href={"#"} className="flex w-full">
              Edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {identity === 'journal' ? (
            <JournalOperationsMenu id={id} />
          ) : (
            <TaskOperationsMenu id={id} />
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}