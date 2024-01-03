import * as React from "react";
import Link from "next/link";
import { useRouter, redirect } from "next/navigation";

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
import { Button } from "react-day-picker";


interface PostProps {
  id: string;
}

export function OperationsMenu(props: PostProps) {
  const router = useRouter();
  const { id } = props;

  const isBlocked = useMutation(api.friends.isBlocked);

  const handleBlock = async () => {
    // Implement logic to block the user
    isBlocked({
      friendId: id as string,
    }).then((res) => {
      router.push("/messaging");
    })

  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          disabled={id ? false : true}
          className="flex px-6 py-2  items-center justify-center  hover:bg-purple-700 bg-purple-500 rounded-lg text-white"
        >
          <span className="sr-only">Open</span>
          ... More
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Link href={"#"} className="flex w-full" onClick={handleBlock}>
              Un friend
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
