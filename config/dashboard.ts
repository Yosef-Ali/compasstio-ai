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
      title: "Chat with ai",
      href: "/chat-with-ai",
      icon: "bot",
    },
    {
      title: "Chat with Group",
      href: "/chat-with-groups",
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
