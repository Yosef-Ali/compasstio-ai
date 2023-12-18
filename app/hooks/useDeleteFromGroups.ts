import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function useDeleteFromGroups(id: Id<"users">) {
  const router = useRouter();
  const useDelete = useMutation(api.friends.isBlocked);

  const handleDelete = async () => {
    await useDelete({ friendId: id });

    toast.promise(Promise.resolve(), {
      loading: "Deleting journal...",
      success: "Journal deleted!",
      error: "Failed to delete journal.",
    });
  };

  return { useDelete: handleDelete };
}
