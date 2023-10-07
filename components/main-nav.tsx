import { MainNavItem } from "@/types"
import { Icons } from "./icons"
import Link from "next/link"
import { siteConfig } from "@/config/site"
import Image from "next/image"
interface MainNavProps {
  items?: MainNavItem[]
  children?: React.ReactNode
}
export function MainNav({ items, children }: MainNavProps) {
  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/" className="hidden items-center space-x-2 md:flex">
        <Image src="./logo.svg" alt="Logo" width={30} height={30} />
        <span className="hidden font-bold sm:inline-block text-xl">
          {siteConfig.name}
        </span>
      </Link>
    </div>
  )
}