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

const TasksPage = () => {
  const { user } = useUser();
  const isOpen = useOnCreate((state) => state.isOpen);
  const toggleOpen = useOnCreate((state) => state.toggleOpen);

  useEffect(() => {
    useOnCreate.setState({ isOpen });
  }, [isOpen]);

  const onCreate = () => {
    toggleOpen(!isOpen);
  };

  return (
    <div>
      <TopNav />
      <Shell>
        <Wrapper>
          <NewTask />
          {/* <DataTableContainer /> */}
        </Wrapper>
        <RightAside tabs={tabs} />
      </Shell>
    </div>
  );
};

export default TasksPage;