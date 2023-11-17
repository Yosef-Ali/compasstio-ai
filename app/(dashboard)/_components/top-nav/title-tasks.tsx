import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface TitleProps {
  taskId: Id<"tasks">;
}

const TitleTasks = ({ taskId }: TitleProps) => {

  const task = useQuery(api.tasks.getById, { taskId });

  return (
    <h1>{task?.title}</h1>
  );

};

export default TitleTasks

