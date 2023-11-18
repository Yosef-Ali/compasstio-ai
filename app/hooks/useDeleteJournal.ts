import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function useDeleteJournal(id: Id<"journals">) {
  const router = useRouter();
  const deleteJournal = useMutation(api.journals.remove);

  const handleDelete = () => {
    const promise = deleteJournal({ id }).then(() => {
      router.back();
    });

    toast.promise(promise, {
      loading: "Deleting journal...",
      success: "Journal deleted!",
      error: "Failed to delete journal.",
    });
  };

  return { deleteJournal: handleDelete };
}
