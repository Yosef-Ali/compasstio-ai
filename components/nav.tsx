"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { SidebarNavItem } from "@/types"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import useWindowPositionAndMobile from "@/app/hooks/useWindowPositionAndMobile"

interface DashboardNavProps {
  items: SidebarNavItem[]
}


export function DashboardNav({ items }: DashboardNavProps) {
  const { isMobile } = useWindowPositionAndMobile()
  const pathname = usePathname()
  const currentPath = `/${pathname.split('/')[1]}`;

  if (!items?.length) {
    return null
  }
  const showCustomDrawer = isMobile && window.innerWidth <= 425;
  return (
    <nav className="grid items-start gap-2">
      {items.map((item, index) => {
        const Icon = Icons[item.icon || "arrowRight"]
        return (
          item.href && (
            <Link key={index} href={item.disabled ? "/" : item.href}>
              <span
                className={cn(
                  "group flex items-center rounded-md px-3 py-2 text-md font-medium hover:bg-accent hover:text-accent-foreground",
                  currentPath === item.href ? "bg-accent" : "transparent",
                  item.disabled && "cursor-not-allowed opacity-80"
                )}
              >
                <Icon className="mr-2 h-5 w-5 text-purple-500" />
                <span>{item.title}</span>
              </span>
            </Link>
          )
        )
      })}
    </nav>
  )
}