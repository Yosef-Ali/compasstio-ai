"use client";

import React from 'react';

import { useRouter } from "next/navigation"
import { Id } from "@/convex/_generated/dataModel";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import dynamic from "next/dynamic";
import { useMemo } from "react";
import { ToolbarTasks } from '@/app/(dashboard)/_components/tasks/toolbar-tasks';

interface TaskIdPageProps {
  params: {
    taskId: Id<"tasks">;
  };
};


interface InitialData {
  _id: Id<"tasks">;
  _creationTime: number;
  content?: string | undefined;
  title: string;
  userId: string;
  isArchived: boolean;
  isPublished: boolean;
}

interface TaskSinglePageProps {
  initialData: InitialData;
  onChange: (content: string) => void;
  initialContent: string;
  editable?: boolean;
}

const TaskSinglePage = ({
  params }: TaskIdPageProps) => {
  const router = useRouter();

  const Editor = useMemo(() => dynamic(() => import("@/components/editor"), { ssr: false }), []);

  const task = params.taskId ? useQuery(api.tasks.getById, { taskId: params.taskId }) : null;

  const update = useMutation(api.tasks.update);

  const onChange = (description: string) => {
    update({
      id: params.taskId,
      description
    });
  };

  if (task === undefined) {
    return (
      <div>
        <div className="md:max-w-3xl lg:max-w-4xl mx-auto p-12">
          <div className="space-y-4 pl-8 pt-4">
            <Skeleton className="h-14 w-[50%]" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[40%]" />
            <Skeleton className="h-4 w-[60%]" />
          </div>
        </div>
      </div>
    );
  }

  if (task === null) {
    return <div>Not found</div>
  }

  // Component logic

  return (

    <div className="max-w-3xl flex flex-col p-12 space-y-3">
      <ToolbarTasks initialData={task} />
      <Editor
        onChange={onChange}
        initialContent={task.description || ""}
        editable
      />
    </div>
  );
};

export default TaskSinglePage;
