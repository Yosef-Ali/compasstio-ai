"use client";

import DoneTasks from "@/app/(dashboard)/_components/tasks/done-task";
import InprogressTasks from "@/app/(dashboard)/_components/tasks/inprogress-tasks";
import TopNav from "@/app/(dashboard)/_components/top-nav";
import Wrapper from "@/app/(dashboard)/_components/wrapper";
import Shell from "@/app/(dashboard)/_components/shell";
import RightAside from "@/app/(dashboard)/_components/right-aside";

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

const TasksSinglePageLayout = ({
  children
}: {
  children: React.ReactNode;
}) => {

  // const dynamic = 'force-dynamic'

  return (
    <>
      <TopNav page="tasks" />
      <Shell>
        <Wrapper>
          {children}
        </Wrapper>
        <RightAside tabs={tabs} />
      </Shell>
    </>
  );
};

export default TasksSinglePageLayout;