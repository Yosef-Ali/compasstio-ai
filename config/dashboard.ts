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
      href: "/chat-with-group",
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
      title: "Sessions",
      href: "/Sessions",
      icon: "video",
    },
  ],
};
