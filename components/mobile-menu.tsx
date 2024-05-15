import React from 'react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from './ui/button';
import { DashboardNav } from './nav';
import { dashboardConfig } from '@/config/dashboard';

import { ChevronUpIcon } from 'lucide-react';
import { UpgradeModal } from '@/app/(dashboard)/_components/upgrade-modal';
import { UserButton } from '@clerk/nextjs';
import { ModeToggle } from './mode-toggle';

export const CustomDrawer = () => {
  const [open, setOpen] = React.useState(false);
  const [openUpgrade, setOpenUpgrade] = React.useState(false);

  const handleUpgrade = () => {
    setOpenUpgrade(true);
  }

  return (
    <>
      <Drawer open={open} onOpenChange={setOpen} >
        <div className="z-30 fixed bottom-1 right-6 border">
          <DrawerTrigger  >
            <Button variant="outline" size="icon">
              <ChevronUpIcon className="h-5 w-5" />
            </Button>
          </DrawerTrigger>
        </div>
        <DrawerContent className='p-3'>
          <DashboardNav items={dashboardConfig.sidebarNav} />
          <div className='w-40 m-2'>
            <button onClick={handleUpgrade}
              data-testid="upgrade-button" aria-label="Upgrade to Pro" className="focus:outline-none flex select-none items-center py-3 text-xs font-medium ring-offset-2 focus:ring-2 text-white justify-center rounded-lg bg-purple-500 hover:bg-purple-700 w-full px-5">
              <span className="flex-nowrap whitespace-nowrap mr-2">Upgrade to Pro</span>
              <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                <path d="M15.4529 7.5996L13.7425 5.64385L13.9809 3.05722L11.4503 2.48241L10.1254 0.239258L7.74208 1.2627L5.35874 0.239258L4.03387 2.4754L1.50332 3.0432L1.74165 5.63684L0.03125 7.5996L1.74165 9.55535L1.50332 12.149L4.03387 12.7238L5.35874 14.9599L7.74208 13.9295L10.1254 14.9529L11.4503 12.7168L13.9809 12.142L13.7425 9.55535L15.4529 7.5996ZM5.9055 10.4106L4.23716 8.72819C3.96378 8.4548 3.96378 8.01318 4.23716 7.7398L4.28623 7.69073C4.55961 7.41735 5.00824 7.41735 5.28163 7.69073L6.41021 8.82633L10.0203 5.20924C10.2937 4.93586 10.7423 4.93586 11.0157 5.20924L11.0648 5.25831C11.3381 5.53169 11.3381 5.97332 11.0648 6.2467L6.91492 10.4106C6.62752 10.6839 6.1859 10.6839 5.9055 10.4106Z" fill="white"></path>
              </svg>
            </button>
          </div>

          <DrawerFooter>
            <div className="flex items-center justify-end">
              <DrawerClose>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </div>
          </DrawerFooter>
        </DrawerContent>

      </Drawer>
      <UpgradeModal open={openUpgrade} setOpen={setOpenUpgrade} />
    </>
  );
};
