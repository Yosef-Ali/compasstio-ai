"use client"

import { useMutation } from "convex/react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Icons } from "@/components/icons"
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import useDeleteChat from "@/app/hooks/useDeleteChat";


interface PostProps {
  id: Id<"chats">;
  isPinned: string;
}
interface RecentChatOptionsProps {
  id: string;
  onDelete: () => void;
}

export default function OperationsMenuChat({ id, isPinned }: PostProps) {
  const { deleteChat } = useDeleteChat(id as Id<"chats">);


  const onDelete = () => {
    deleteChat();
  };


  if (isPinned !== "isPinned") {
    return (
      <RecentChatOptions
        id={id}
        onDelete={onDelete}
      />
    );
  }

  return (
    <PinnedChatOptions
      id={id}
      onDelete={onDelete}
    />
  );
}



function RecentChatOptions({ id, onDelete }: RecentChatOptionsProps) {
  const Pinned = useMutation(api.chats.pinned);

  const pinChat = () => {
    Pinned({
      id: id as Id<"chats">,
    });
  }

  return (

    <DropdownMenu>
      <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md border transition-colors hover:bg-muted">
        <Icons.ellipsis className="h-4 w-4" />
        <span className="sr-only">Open</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={pinChat}>
          Pin Chat
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onDelete}>
          Delete Chat
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function PinnedChatOptions({ id, onDelete }: RecentChatOptionsProps) {
  const unpinChat = useMutation(api.chats.unPinned);

  const pinChat = () => {
    unpinChat({
      id: id as Id<"chats">,
    });
  }


  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md border transition-colors hover:bg-muted">
        <Icons.ellipsis className="h-4 w-4" />
        <span className="sr-only">Open</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={pinChat}>
          Unpin Chat
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onDelete}>
          Delete Chat
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

  );
}