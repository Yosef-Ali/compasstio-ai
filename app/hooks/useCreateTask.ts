import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function useCreateTask(id: Id<"tasks">) {
  const router = useRouter();
  const createTask = useMutation(api.tasks.create);

  const handleCreateTask = () => {
    const promise = createTask({ title: "Untitled" }).then((taskId) => {
      router.push(`/tasks/${taskId}`);
    });

    toast.promise(promise, {
      loading: "Creating a new task...",
      success: "New task created!",
      error: "Failed to create a new task.",
    });
  };

  return { createTask: handleCreateTask };
}
