"use client";
import { useConvexAuth } from "convex/react";
import { SignInButton, UserButton } from "@clerk/clerk-react";

import { MainNavItem } from "@/types"

import Link from "next/link"
import { siteConfig } from "@/config/site"
import Image from "next/image"
import { Button, buttonVariants } from "./ui/button"
import { Spinner } from "./spinner";
import { cn } from "@/lib/utils"

interface MainNavProps {
  items?: MainNavItem[]
  children?: React.ReactNode
}

export function MainNav({ items, children }: MainNavProps) {
  const { isAuthenticated, isLoading } = useConvexAuth();

  return (
    <>
      <div className="flex h-20 items-center justify-between py-6 z-40">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="hidden items-center space-x-2 md:flex mr-3">
            <Image src="./logo.svg" alt="Logo" width={30} height={30} />
            <span className="hidden font-bold sm:inline-block text-xl text-white">
              {siteConfig.name}
            </span>
          </Link>
        </div>

        <div className="md:ml-auto md:justify-end justify-between w-full flex items-center gap-x-2">
          {isLoading && (
            <Spinner />
          )}
          {!isAuthenticated && !isLoading && (
            <>
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm" className="text-purple-400">
                  Log in
                </Button>
              </SignInButton>
              <SignInButton mode="modal">
                <Button size="sm" className="bg-purple-500 hover:bg-purple-700">
                  Get free
                </Button>
              </SignInButton>
            </>
          )}
          {isAuthenticated && !isLoading && (
            <>
              <Button variant="ghost" size="sm" asChild className="bg-purple-500 hover:bg-purple-700">
                <Link href="/chat-with-ai">
                  Enter workspace
                </Link>
              </Button>
              <UserButton
                afterSignOutUrl="/chat-with-ai"
              />
            </>
          )}

        </div>
      </div >
    </>
  )
}