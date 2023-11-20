import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useParams } from "next/navigation";
import { useState } from "react";
import ItemButton from "../item-button";
import { PlusCircle } from "lucide-react";
import useCreateTask from "@/app/hooks/useCreateTask";

interface TitleProps {
  taskId?: Id<"tasks">;
}

const TopNavTasks = () => {
  const { taskId } = useParams<{ taskId: Id<"tasks"> }>();
  const { createTask } = useCreateTask(taskId)


  let task = taskId ? useQuery(api.tasks.getById, { taskId }) : null;

  const handleCreateTask = () => {
    createTask()
  };

  return (
    <div className="sticky top-0 z-40 bg-background ">
      <div className="w-full">
        <div className=" pl-5 pr-5 py-3 md:pr-8 border-b  flex-1 flex  w-full">
          <div className="flex items-center w-full p-1">
            <div className="flex text-xl line-clamp-1">{task?.title || "Untitled"}</div>
          </div>
          <div className="flex shrink-0 items-center">
            <ItemButton
              onClick={handleCreateTask}
              label="New Task"
              icon={PlusCircle}
            />
          </div>
        </div>
      </div>
    </div>
  );

};

export default TopNavTasks;

