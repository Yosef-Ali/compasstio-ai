import * as React from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Icons } from "@/components/icons";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { Id } from "@/convex/_generated/dataModel";
import useDeleteFromGroups from "@/app/hooks/useDeleteFromGroups";

// interface PostProps {
//   id: Id<"users">;
//   identity: string;
// }

interface OperationsMenuProps {
  _id: Id<"users">;
  userId: string;

}


export function OperationsMenu({ _id, userId }: OperationsMenuProps) {
  const router = useRouter();
  //const { id } = useParams();
  const { user } = useUser();
  const addToGroup = useMutation(api.groups.create);
  const deleteFromGroup = useMutation(api.groups.deleteGroup);



  const handleAddToGroup = () => {
    addToGroup({
      userId
    })
  }

  const handleBlock = () => {
    // Implement logic to block the user
    //useDeleteFromGroups(_id);

    deleteFromGroup({
      _id
    })
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          className="flex h-8 w-8 items-center justify-center rounded-md border transition-colors hover:bg-muted"
        >
          <Icons.ellipsis className="h-4 w-4" />
          <span className="sr-only">Open</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Link href={"#"} className="flex w-full" onClick={handleAddToGroup}>
              Add to group
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link href={"#"} className="flex w-full" onClick={handleBlock}>
              Block
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
