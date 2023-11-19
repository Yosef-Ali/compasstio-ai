import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function useCreateJournal(id: Id<"journals">) {
  const router = useRouter();
  const createJournal = useMutation(api.journals.create);

  const handleCreateJournal = () => {
    const promise = createJournal({ title: "Untitled" }).then((journalId) => {
      router.push(`/journals/${journalId}`);
    });

    toast.promise(promise, {
      loading: "Creating a new note...",
      success: "New note created!",
      error: "Failed to create a new note.",
    });
  };

  return { createJournal: handleCreateJournal };
}
