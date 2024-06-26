"use client"

import { api } from "@/convex/_generated/api";
import { useConvexAuth, useQuery } from "convex/react";

import { Id, Doc } from "@/convex/_generated/dataModel";


import { TaskCardDone } from "./task-card-done";

interface Task extends Doc<"tasks"> {
  _id: Id<"tasks">
  _creationTime: number
  content?: string | undefined
  title: string
  userId: string
  isArchived: boolean
  isPublished: boolean
}



export default function CurrentTasks() {
  const tasks = useQuery(api.tasks.getDone) as Task[] | undefined;
  const { isLoading } = useConvexAuth()

  if (tasks === undefined || isLoading) {
    return (
      <div className="space-y-3">
        <TaskCardDone.Skeleton />
        <TaskCardDone.Skeleton />
        <TaskCardDone.Skeleton />
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 gap-4 p-3">
      {tasks?.filter(task => task.status === "done").map(task => (
        <TaskCardDone
          key={task._id}
          _id={task._id}
          title={task.title ?? " "}
          description={task.description ?? " "}
          status={task.status ?? " "}
          creationTime={task._creationTime}
          dueDate={task.dueDate ?? 0}
          onClick={() => { }}
        />
      ))}
    </div>
  );
}