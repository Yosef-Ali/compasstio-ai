import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Icons } from "@/components/icons";
import ItemButton from "@/app/(dashboard)/_components/item-button";
import { MoreHorizontal } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";

interface PostProps {
  id: string;
}

export function OperationsMenu(props: PostProps) {
  const router = useRouter();
  const { id } = props;

  const isBlocked = useMutation(api.friends.isBlocked);
  const addToFriend = useMutation(api.friends.createFriend);


  const handleAddToGroup = async () => {
    // Implement logic to add the post to a group

    addToFriend({
      friendId: id as Id<"users">
    })
  };

  const handleBlock = async () => {
    // Implement logic to block the user
    console.log("Blocking user");

    isBlocked({
      friendId: id as Id<"users">,
    })
    //router.push("/chat-with-groups");
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          disabled={id ? false : true}
        >
          <span className="sr-only">Open</span>
          <ItemButton
            // onClick={handleCreate}
            label="More"
            icon={MoreHorizontal}
          />
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
