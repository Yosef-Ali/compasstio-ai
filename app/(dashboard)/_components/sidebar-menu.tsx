"use client"
import { UserButton, useUser } from "@clerk/clerk-react";
import { DashboardNav } from '@/components/nav'
import { dashboardConfig } from '@/config/dashboard'
import Link from 'next/link'
import React, { useState } from 'react'
import { ChevronsDownUp } from "lucide-react";
import { UserItem } from "@/components/user-item";
import { useAction, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { UpgradeModal } from "./upgrade-modal";
import { ModeToggle } from "@/components/mode-toggle";

//import "@/styles/CustomUserButton.css"



const SideMenu = () => {
  const { user } = useUser();
  const [open, setOpen] = useState(false);



  const handleUpgrade = () => {
    setOpen(true);
  }

  return (
    <>
      <div className="md:sticky top-0">
        <div id="sidebar" className='fixed flex md:top-0 z-0 opacity-100 w-full transition-all md:sticky md:h-screen md:w-auto md:min-w-min mt-16 md:mt-0'>
          <div id="desktop" className='hidden md:block'>
            <div className="flex h-screen w-full flex-col justify-start border-r   pl-3 md:min-h-screen md:w-64 md:bg-grey-100 md:pl-8 md:pb-0">
              <div className="flex h-full flex-col justify-between pb-40 md:pb-0">

                <div className="pr-3">
                  <div className="hidden flex-row items-center justify-between py-2 pr-2 md:py-4 md:flex">
                    <div className="h-8 w-20 md:w-32">
                      <Link href="/">
                        <h1 className='text-[22px] font-semibold'>shibahumanity.ai</h1>
                      </Link>
                    </div>
                  </div>

                  {/* profile car is here */}
                  <div className="block pr-3 md:hidden">
                    <div className="z-30 flex h-20 cursor-pointer items-center justify-between py-10 sticky top-0">
                      <button className='focus:outline-none flex h-full w-full cursor-pointer items-center text-left focus:ring-0'>
                        profile button
                      </button>
                    </div>
                  </div>
                  <div className="mt-8 pr-3">
                    <div className="absolute left-0 h-10 w-1.5 rounded-r-lg bg-purple-500"></div>
                    <DashboardNav items={dashboardConfig.sidebarNav} />
                    <div className="pr-6 h-min mt-3">
                      <div className="border-b border-silver-300 h-0 w-full"></div>
                    </div>
                  </div>
                </div>
                <div>

                  <div className="hidden pr-6 md:block">
                    <div className="w-full">
                      <button onClick={handleUpgrade}
                        data-testid="upgrade-button" aria-label="Upgrade to Pro" className="focus:outline-none flex select-none items-center py-3 text-xs font-medium ring-offset-2 focus:ring-2 text-white justify-center rounded-lg bg-purple-500 hover:bg-purple-700 w-full px-5">
                        <span className="flex-nowrap whitespace-nowrap mr-2">Upgrade to Pro</span>
                        <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                          <path d="M15.4529 7.5996L13.7425 5.64385L13.9809 3.05722L11.4503 2.48241L10.1254 0.239258L7.74208 1.2627L5.35874 0.239258L4.03387 2.4754L1.50332 3.0432L1.74165 5.63684L0.03125 7.5996L1.74165 9.55535L1.50332 12.149L4.03387 12.7238L5.35874 14.9599L7.74208 13.9295L10.1254 14.9529L11.4503 12.7168L13.9809 12.142L13.7425 9.55535L15.4529 7.5996ZM5.9055 10.4106L4.23716 8.72819C3.96378 8.4548 3.96378 8.01318 4.23716 7.7398L4.28623 7.69073C4.55961 7.41735 5.00824 7.41735 5.28163 7.69073L6.41021 8.82633L10.0203 5.20924C10.2937 4.93586 10.7423 4.93586 11.0157 5.20924L11.0648 5.25831C11.3381 5.53169 11.3381 5.97332 11.0648 6.2467L6.91492 10.4106C6.62752 10.6839 6.1859 10.6839 5.9055 10.4106Z" fill="white"></path>
                        </svg>
                      </button>
                    </div>
                    <div className="z-30 flex h-20 cursor-pointer items-center justify-between py-10 relative">
                      <button className="focus:outline-none flex h-full w-full cursor-pointer items-center text-left focus:ring-0">
                        <div className="custom-user-button">
                          <UserButton showName={true} />
                        </div>
                      </button>
                      <ModeToggle />
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div >
      <UpgradeModal open={open} setOpen={setOpen} />
    </>
  )
}

export default SideMenu