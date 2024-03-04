"use client";

import { useConvexAuth } from "convex/react";
import { redirect } from "next/navigation";
import { Spinner } from "@/components/spinner";
import SideMenu from "../_components/sidebar-menu"


const MainLayout = ({ children }) => {

  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
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
      <main className="flex flex-col h-screen w-full self-center">{children}</main>
    </div>


  )
}
export default MainLayout;