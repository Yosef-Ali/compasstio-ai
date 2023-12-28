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
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { ChevronUpIcon } from 'lucide-react';

export const CustomDrawer = () => {
  const [open, setOpen] = React.useState(false);
  return (

    <Drawer open={open} onOpenChange={setOpen} >
      <div className="z-30 fixed bottom-1 left-0 right-0 flex justify-center ">
        <DrawerTrigger  >
          <Button variant="outline" size="icon">
            <ChevronUpIcon className="h-5 w-5" />
          </Button>
        </DrawerTrigger>
      </div>
      <DrawerContent>
        <DashboardNav items={dashboardConfig.sidebarNav} />
        <DrawerFooter>
          <DrawerClose>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>

  );
};
