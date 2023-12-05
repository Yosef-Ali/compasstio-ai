import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function usePinnedChat(id: Id<"chats">) {
  const router = useRouter();
  const pinnedChat = useMutation(api.chats.pinned);

  const handlePinnedChat = () => {
    const promise = pinnedChat({ id })

    toast.promise(promise, {
      loading: "Pinned a Chat...",
      success: "New chat saved!",
      error: "Failed to pin a chat.",
    });
  };

  return { pinnedChat: handlePinnedChat };
}
