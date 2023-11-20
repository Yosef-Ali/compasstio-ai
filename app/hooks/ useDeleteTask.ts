import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function useDeleteTasks(id: Id<"tasks">) {
  const router = useRouter();
  const deleteTask = useMutation(api.tasks.remove);

  const handleDelete = () => {
    const promise = deleteTask({ id }).then(() => {
      router.push("/tasks");
      //router.refresh();
      //router.back();
    });

    toast.promise(promise, {
      loading: "Deleting Task...",
      success: "Task deleted!",
      error: "Failed to delete Task.",
    });
  };

  return { deleteTask: handleDelete };
}
