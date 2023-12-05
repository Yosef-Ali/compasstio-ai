import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function useDeleteChat(id: Id<"chats">) {
  const router = useRouter();
  const deleteChat = useMutation(api.chats.deleteChat);

  const handleDeleteChat = () => {
    const promise = deleteChat({ id })

    toast.promise(promise, {
      loading: "Deleting a Chat...",
      success: "Chat deleted!",
      error: "Failed to delete a chat.",
    });
  };

  return { deleteChat: handleDeleteChat };
}
