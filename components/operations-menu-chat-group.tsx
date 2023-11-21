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
import ItemButton from "@/app/(dashboard)/_components/item-button";
import { MoreHorizontal } from "lucide-react";

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
          className=""
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
