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

interface PostProps {
  id: string;
  identity: string;
}

export function OperationsMenu() {
  const router = useRouter();
  const { id } = useParams();

  const handleAddToGroup = async () => {
    // Implement logic to add the post to a group
    console.log("Adding post to group");
  };

  const handleBlock = async () => {
    // Implement logic to block the user
    console.log("Blocking user");
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
