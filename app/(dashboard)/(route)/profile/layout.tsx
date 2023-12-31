"use client"

import React, { useEffect } from 'react'
import TopNav from '../../_components/top-nav'
import Shell from '../../_components/shell'
import Wrapper from '../../_components/wrapper'
import { Button } from '@/components/ui/button'
import { PlusCircleIcon } from 'lucide-react'
import RightAside from '../../_components/right-aside'
import ChatWithGroup from '../../_components/chat-with-group/chat-with-group'
import { useOnCreate } from "@/app/hooks/use-on-create";
import { useUser } from "@clerk/clerk-react";
import ChatContainer from '../../_components/chat-container'
import AllUsers from '../../_components/chat-with-group/all-users'
import { useConvexAuth } from 'convex/react'
import { Spinner } from '@/components/spinner'
import { redirect } from 'next/navigation'

interface ChatWithGroupPageProps {
  children: React.ReactNode
}

const tabs = [
  {
    name: 'Messages',
    title: 'Messages',
    content: <ChatWithGroup />

  },
  {
    name: 'Invite Friends',
    title: 'Invite Friends',
    content: <AllUsers />
  }
];

const ProfilePageLayout = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const { user } = useUser();
  const isOpen = useOnCreate((state) => state.isOpen);
  const toggleOpen = useOnCreate((state) => state.toggleOpen);

  useEffect(() => {
    useOnCreate.setState({ isOpen });
  }, [isOpen]);

  const onCreate = () => {
    toggleOpen(!isOpen);
  };
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return redirect("/");
  }
  return (<>
    <TopNav />
    <Shell>
      <Wrapper>
        {children}
      </Wrapper>
      <RightAside tabs={tabs} />
    </Shell>
  </>
  )
}

export default ProfilePageLayout


