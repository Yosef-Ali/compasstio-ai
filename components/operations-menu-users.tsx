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

  const handleAddToFriend = async () => {
    addToFriend({
      friendId: _id
    })
  }


  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Icons.ellipsis />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleAddToFriend}>
            Add to group
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

