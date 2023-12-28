"use client"

import { useEffect, useState } from "react";
import { useSlideState } from "@/app/hooks/useSlideState";
import useWindowPositionAndMobile from "@/app/hooks/useWindowPositionAndMobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"

import { cn } from "@/lib/utils";


interface Tab {
  name: string;
  title: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
}


const RightAside = ({ tabs }: TabsProps) => {
  const { isSlideOut, toggleSlide } = useSlideState(); // Initialize isSlideOut to false

  const { isMobile, isTablet, isDesktop } = useWindowPositionAndMobile()

  useEffect(() => {
    if (isMobile) {
      toggleSlide(); // Call toggleSlide to trigger the state change
    }
  }, [isMobile, toggleSlide]);


  const asideWidth = cn({
    "w-0": (isDesktop || isTablet || isMobile) && isSlideOut,
    "w-full": isMobile && !isSlideOut,
    "lg:w-2/5 ": isTablet && !isSlideOut,
    "xl:w-2/6 ": isDesktop && !isSlideOut,
  });
  return (
    <>
      <div className={cn(asideWidth, `${isMobile && isSlideOut ? 'w-full' : 'w-0 sm:w-0'}  h-full border border-l relative transition-width duration-500`)}>

        {isMobile ?
          <>
            <button
              onClick={toggleSlide}
              className={`  z-50 absolute -left-16 top-1/3 -translate-y-1/2 bg-purple-500 hover:bg-purple-800 text-white  py-2 px-6 rounded-lg rounded-t-none  rotate-90`
              }
            >
              {isSlideOut ? 'Close' : 'Open'}
            </button>
            <button
              onClick={toggleSlide}
              className={` z-50 absolute -left-7 top-1/3 -translate-y-1/2  bg-purple-500 hover:bg-purple-800 text-white  py-2 px-6 rounded-lg rounded-b-none  rotate-90`
              }
            >
              {isSlideOut ? 'Close' : 'Open'}
            </button>
          </>
          : <button
            onClick={toggleSlide}
            className={`  z-50 absolute -left-16 top-1/3 -translate-y-1/2 bg-purple-500 hover:bg-purple-800 text-white  py-2 px-6 rounded-lg rounded-t-none  rotate-90`
            }
          >
            {isSlideOut ? 'Open' : 'Close'}
          </button>}

        <div className="flex-1 h-full">
          <Tabs defaultValue={tabs[0].name} className="w-full">
            <div className="border-b px-6 pt-4 pb-2 text-center sticky top-0 bg-background z-35">
              <TabsList className="grid w-full grid-cols-2">
                {tabs.map(tab => (
                  <TabsTrigger key={tab.name} value={tab.name}>
                    {tab.title}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {tabs.map(tab => (
              <TabsContent key={tab.name} value={tab.name} className="p-4 ">
                <ScrollArea className="h-[82vh] w-full">
                  {tab.content}
                </ScrollArea>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </>
  );

}


export default RightAside
