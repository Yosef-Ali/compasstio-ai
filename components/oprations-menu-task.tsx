
"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Icons } from "@/components/icons"
import { Id } from "@/convex/_generated/dataModel";
import useDeleteTask from "@/app/hooks/useDeleteTask";
import { useRouter } from "next/navigation";

interface PostProps {
  id: Id<"tasks">;
}

interface RecentTaskOptionsProps {
  id: string;
}

export default function OperationsMenuTasks({ id }: PostProps) {

  return (
    <TaskOptions id={id} />
  );
}


function TaskOptions({ id }: RecentTaskOptionsProps) {
  const { deleteTask } = useDeleteTask(id as Id<"tasks">);
  const router = useRouter();


  const onDeleteTask = async () => {
    try {
      await deleteTask();
      router.push('/tasks');
    } catch (error: any) {
      // Handle the "Not found" error here
      if (error.message === "Not found") {
        // Display an error message or redirect the user to a different page
        console.error("Task not found. It might have been deleted.");
        router.push('/tasks'); // Redirect to the '/tasks' page
      } else {
        // Handle other errors
        console.error("An error occurred:", error);
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md border transition-colors hover:bg-muted">
        <Icons.ellipsis className="h-4 w-4" />
        <span className="sr-only">Open</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={onDeleteTask}>
          Delete Tasks
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}