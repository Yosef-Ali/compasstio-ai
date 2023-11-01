"use client"
import { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";

import Shell from "../../_components/shell";
import TopNav from "../../_components/top-nav";
import RightAside from "../../_components/right-aside";
import WelcomeMessage from "@/components/welcome-message";
import DoneTasks from "@/app/(dashboard)/_components/tasks/done-task";

import { useOnCreate } from "@/app/hooks/use-on-create";
import Wrapper from "../../_components/wrapper";

const tabs = [
  {
    name: 'Participant',
    title: 'In progress',
    content: <DoneTasks />
  },
  {
    name: 'Done',
    title: 'Done',
    content: <DoneTasks />
  }
];

const LiveStreamPage = () => {
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
          <div className="h-full flex flex-col p-6 relative">
            <div className="flex flex-col w-full">
              <img src="/mux-meet.jpeg" className="w-full bg-cover absolute inset-0 z-0" />
              {!isOpen && (
                <div className="absolute inset-0 z-10 flex items-center justify-center">
                  <WelcomeMessage
                    userFullName={user?.fullName}
                    onCreate={onCreate}
                    buttonLabel="Create a Tasks"
                  />
                </div>
              )}
            </div>
          </div>
        </Wrapper>
        <RightAside tabs={tabs} />
      </Shell>
    </div>
  );
};

export default LiveStreamPage;