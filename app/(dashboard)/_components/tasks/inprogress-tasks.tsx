"use client"
import { api } from "@/convex/_generated/api";
import { useConvexAuth, useQuery } from "convex/react";
import { Id, Doc } from "@/convex/_generated/dataModel";

import { TaskCardInProgress } from "./task-card-inpro";

interface Task extends Doc<"tasks"> {
  _id: Id<"tasks">
  _creationTime: number
  content?: string | undefined
  title: string
  userId: string
  isArchived: boolean
  isPublished: boolean
}


export default function InprogressTasks() {
  const tasks = useQuery(api.tasks.get) as Task[] | undefined;
  const { isLoading } = useConvexAuth()

  if (tasks === undefined || isLoading) {
    return (
      <div className="space-y-3">
        <TaskCardInProgress.Skeleton />
        <TaskCardInProgress.Skeleton />
        <TaskCardInProgress.Skeleton />
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 gap-4 p-3">
      {tasks?.map((task) => (
        <TaskCardInProgress
          key={task._id}
          _id={task._id}
          title={task.title || " "}
          description={task.description || " "}
          status={task.status || " "}
          dueDate={task.dueDate || 0}
          creationTime={task._creationTime}
          onClick={() => { }}
        />
      ))}
    </div>
  );
}
