import * as React from "react"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { ModeToggle } from "@/components/mode-toggle"
import Image from "next/image"

export function SiteFooter({ className }: React.HTMLAttributes<HTMLElement>) {
  return (
    <footer className={cn(className)}>
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0 absolute bottom-0 left-0 right-0 z-40 ">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0 ">
          <Image src="./logo.svg" alt="Logo" width={30} height={30} />
          <span className="hidden font-bold sm:inline-block text-xl text-white/70">
            {siteConfig.name}
          </span>

        </div>
        <div><p className="text-center text-sm leading-loose md:text-left text-white/70">
          Built by{" "}
          <a
            href={siteConfig.links.twitter}
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4 text-white/70"
          >
            DataTech
          </a>
        </p>
        </div>
        <ModeToggle />
      </div>
    </footer>
  )
}