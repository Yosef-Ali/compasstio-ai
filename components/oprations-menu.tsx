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


export function OperationsMenu({ id, identity }: PostProps) {
  const router = useRouter();
  const params = useParams();
  const [journalHook, setJournalHook] = React.useState(null);
  const [taskHook, setTaskHook] = React.useState(null);

  const { deleteJournal } = useDeleteJournal(id as Id<"journals">);
  const { deleteTask } = useDeleteTasks(id as Id<"tasks">);

  const handleDelete = (identity: string) => {
    if (identity === 'journal') {
      deleteJournal();
    } else {
      deleteTask();
    }
  }

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
          <DropdownMenuItem
            className="flex cursor-pointer items-center text-destructive focus:text-destructive"
            onSelect={() => handleDelete(identity)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}