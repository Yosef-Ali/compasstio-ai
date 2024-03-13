"use client"

import TopNav from '../../_components/top-nav'
import Shell from '../../_components/shell'
import Wrapper from '../../_components/wrapper'
import RightAside from '../../_components/right-aside'
import { useConvexAuth } from 'convex/react'
import { Spinner } from '@/components/spinner'
import { redirect } from 'next/navigation'



const tabs = [
  {
    name: 'No name',
    title: 'No title',
    content: null

  },
  {
    name: 'No name',
    title: 'No title',
    content: null
  }
];


const ProfilePageLayout = ({
  children
}: {
  children: React.ReactNode;
}) => {


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
  return (
    <>
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


