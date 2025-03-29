"use client";

import { useConvexAuth } from "convex/react";
import { redirect } from "next/navigation";
import { Spinner } from "@/components/spinner";
import { MeetingProvider } from "@/app/context/MeetingContext";
import dynamic from 'next/dynamic';

// Dynamically import MeetingContext hook to prevent SSR issues
const ClientMeetingContent = dynamic(
  () => import("./ClientMeetingContent").then((mod) => mod.default),
  { ssr: false }
);

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

  // Simple layout for server side rendering
  return (
    <MeetingProvider>
      <ClientMeetingContent>{children}</ClientMeetingContent>
    </MeetingProvider>
  )
}

export default MainLayout;
