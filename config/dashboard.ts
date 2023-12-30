import { DashboardConfig } from "@/types";

export const dashboardConfig: DashboardConfig = {
  mainNav: [
    {
      title: "Documentation",
      href: "/docs",
    },
    {
      title: "Support",
      href: "/support",
      disabled: true,
    },
  ],
  sidebarNav: [
    {
      title: "Chat with AI",
      href: "/chat-with-ai",
      icon: "bot",
    },
    {
      title: "Messaging",
      href: "/messaging",
      icon: "message",
    },
    {
      title: "Journals",
      href: "/journals",
      icon: "book",
    },
    {
      title: "Tasks",
      href: "/tasks",
      icon: "checkSquare",
    },
    {
      title: "Live Session",
      href: "/live-sessions",
      icon: "video",
    },
  ],
};
