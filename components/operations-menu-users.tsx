import * as React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Icons } from "@/components/icons";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";

interface OperationsMenuProps {
  _id: string;
}


export function OperationsMenu({ _id }: OperationsMenuProps) {


  console.log('_id in the OpreationMenu:', _id)


  const addToFriend = useMutation(api.friends.createFriend);
  const deleteFriend = useMutation(api.friends.deleteFriend);

  const handleAddToFriend = async () => {
    addToFriend({
      friendId: _id
    })
  }

  const handleDelete = async () => {

    deleteFriend({
      friendId: _id
    })
  }


  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md border transition-colors hover:bg-muted">
          <Icons.ellipsis className="h-4 w-4" />
          <span className="sr-only">Open</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleAddToFriend}>
            Add to Friends
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDelete}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

