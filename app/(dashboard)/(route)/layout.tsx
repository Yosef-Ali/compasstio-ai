"use client";
import { useConvexAuth } from "convex/react";
import { redirect } from "next/navigation";
import { Spinner } from "@/components/spinner";

import SideMenu from "../_components/sidebar-menu"



interface MainLayoutProps {
  children: React.ReactNode
}

const MainLayout = ({
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

    <div className="flex">
      <SideMenu />
      <main className="flex flex-col h-screen w-full self-center" >{children}</main>
      {/* <main className="min-h-screen flex flex-col h-screen" >{children}</main> */}
    </div>

  )
}
export default MainLayout;