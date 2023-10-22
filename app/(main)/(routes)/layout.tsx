import Link from "next/link"

import { marketingConfig } from "@/config/marketing"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import SideMenu from "../_components/sidebar-menu"



interface MainLayoutProps {
  children: React.ReactNode
}

export default async function MainLayout({
  children,
}: MainLayoutProps) {
  return (
    <div className="h-full max-w-full relative flex flex-1 overflow-hidden">
      <SideMenu />
      <main className="max-w-full flex flex-1 flex-col">{children}</main>
    </div>
  )
}