import * as React from "react"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { ModeToggle } from "@/components/mode-toggle"
import Image from "next/image"

export function SiteFooter({ className }: React.HTMLAttributes<HTMLElement>) {
  return (
    <footer className={cn(className)}>
      <p className="text-md  text-white/70 p-2 text-center">As it is imperative to build community, a percentage of net profit will be donated to philanthropy at our
        discretion.</p>
      <div className="container flex flex-col items-center justify-between gap-3 z-50  md:flex-row">

        <div className="flex items-center gap-2 leading-3">
          <Image src="./logo.svg" alt="Logo" width={30} height={30} />
          <span className="font-bold sm:inline-block text-xl text-white/70">
            {siteConfig.name}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2 ">
          <p className="text-center md:text-left text-sm  text-white/70">
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
          <ModeToggle />
        </div>
      </div>
    </footer>
  )
}