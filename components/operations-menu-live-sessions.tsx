"use client"
import React, { FC, useRef, useState } from 'react';
import { useUser } from "@clerk/nextjs";
import { FileEditIcon, MoreHorizontal, PlusIcon, TrashIcon } from "lucide-react";
import { DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem, DropdownMenuContent, DropdownMenu } from "@/components/ui/dropdown-menu"
import { useDialog } from "@/app/hooks/useDialog";
import { LiveSessionsDialog } from './dialog/liev-session-dialog';


export function OperationsMenu() {
  const { isOpen, onClose, toggleOpen } = useDialog()
  const [dialog, setDialog] = useState("")
  const user = useUser()

  const handleDialogOpen = (dialog: string) => {
    if (dialog === "createGroup") {
      toggleOpen(!isOpen);
      setDialog("createGroup");
    } else if (dialog === "editGroup") {
      toggleOpen(!isOpen);
      setDialog("editGroup");
    } else if (dialog === "deleteGroup") {
      toggleOpen(!isOpen);
      setDialog("deleteGroup");
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          disabled={!user}
          className="flex px-6 py-2 items-center justify-center hover:bg-purple-700 bg-purple-500 rounded-lg text-white"
        >
          <span className="sr-only">Open</span>
          ... More
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Group Options</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => handleDialogOpen("createGroup")}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Create Group
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleDialogOpen("editGroup")}>
            <FileEditIcon className="mr-2 h-4 w-4" />
            Edit Group
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleDialogOpen("deleteGroup")}>
            <TrashIcon className="mr-2 h-4 w-4" />
            Delete Group
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* <DialogDemo /> */}
      {isOpen && (
        <LiveSessionsDialog dialog={dialog} />
      )}
    </>

  );
}
