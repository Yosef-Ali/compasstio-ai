import { useSlideState } from "@/app/hooks/useSlideState";
import { useSlideStateMobile } from "@/app/hooks/useSlideStateMobile";
import useWindowPositionAndMobile from "@/app/hooks/useWindowPositionAndMobile";
import { CustomDrawer } from "@/components/mobile-menu";
import { ModeToggle } from "@/components/mode-toggle";


import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";


interface WrapperProps {
  children: React.ReactNode;
}

const Wrapper: React.FC<WrapperProps> = ({ children }) => {

  const { isSlideOut, toggleSlide } = useSlideState();
  const { isMobile, isTablet, isDesktop } = useWindowPositionAndMobile()
  const [showCustomDrawer, setShowCustomDrawer] = useState(isMobile && window.innerWidth <= 425);


  const asideWidth = cn({
    "w-full": (isDesktop || isTablet) && isSlideOut,
    "lg:w-3/5 ": isTablet && !isSlideOut,
    "xl:w-4/6 ": isDesktop && !isSlideOut,
  });


  useEffect(() => {
    const handleResize = () => {
      setShowCustomDrawer(isMobile && window.innerWidth <= 425);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobile]);

  return (
    <main className={cn(asideWidth, `${isMobile && isSlideOut ? 'w-0' : ' w-full'} h-full overflow-y-auto z-20 transition-width duration-500`)}>
      <div className="h-full w-full flex-col  relative text-center z-20 ">
        {children}
      </div>
      {/* mobile menu */}
      {showCustomDrawer && <CustomDrawer />}
      <div className="z-20 fixed bottom-1 md:hidden ">
        <div className="flex items-center pl-6">
          <UserButton showName={true} />
          <div className="ml-4">

            <ModeToggle />
          </div>
        </div>
      </div>

    </main>
  );
};

export default Wrapper;