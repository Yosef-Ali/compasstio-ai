"use client";
import { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";

import Shell from "../../_components/shell";
import TopNav from "../../_components/top-nav";
import RightAside from "../../_components/right-aside";
import WelcomeMessage from "@/components/welcome-message";
import DoneTasks from "@/app/(dashboard)/_components/tasks/done-task";

import { useOnCreate } from "@/app/hooks/use-on-create";
import Wrapper from "../../_components/wrapper"
import InprogressTasks from "@/app/(dashboard)/_components/tasks/inprogress-tasks";

import DataTableContainer from "../../_components/tasks/data-table-container";
import { Button } from "@/components/ui/button";
import { PlusCircleIcon } from "lucide-react";
import NewTask from "../../_components/tasks/components/new-task";
import { useRouter } from "next/navigation";
import { useConvexAuth, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Spinner } from "@/components/spinner";

interface Props {
  page?: 'chat-with-ai' | 'chat-with-groups' | 'journals' | 'tasks' | 'live-sessions'
}

const tabs = [
  {
    name: 'In progress',
    title: 'In progress',
    content: <InprogressTasks />
  },
  {
    name: 'Done',
    title: 'Done',
    content: <DoneTasks />
  }
];

export const dynamic = 'force-dynamic'

const TasksPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const isOpen = useOnCreate((state) => state.isOpen);
  const toggleOpen = useOnCreate((state) => state.toggleOpen);
  const { isLoading } = useConvexAuth()

  const create = useMutation(api.tasks.create);

  const onCreate = () => {
    const promise = create({ title: "Untitled" })
      .then((taskId) => router.push(`/tasks/${taskId}`))

    toast.promise(promise, {
      loading: "Creating a new note...",
      success: "New note created!",
      error: "Failed to create a new note."
    });

  };


  // useEffect(() => {
  //   useOnCreate.setState({ isOpen });
  // }, [isOpen]);

  // const onCreate = () => {
  //   toggleOpen(!isOpen);
  // };

  return (
    <>
      <TopNav page="tasks" />
      <Shell>
        <Wrapper>
          <div className="max-w-xl mx-auto flex flex-col p-12 space-y-3">
            {isLoading ? (
              <div className="w-full flex items-center justify-center">
                <Spinner size="lg" />
              </div>
            ) : (
              <>
                <h2 className="text-lg font-medium">
                  Welcome to {user?.fullName}&apos;s eternalvirtueai.com
                </h2>
                <Button onClick={onCreate} className="flex">
                  <PlusCircleIcon className="h-4 w-4 mr-2" />
                  Create a Task
                </Button>
              </>
            )
            }
          </div>
          {/* <NewTask /> */}
          {/* <DataTableContainer /> */}
        </Wrapper>
        <RightAside tabs={tabs} />
      </Shell>
    </>
  );
};

export default TasksPage;