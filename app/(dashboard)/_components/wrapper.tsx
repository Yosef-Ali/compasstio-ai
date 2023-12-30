import { useSlideState } from "@/app/hooks/useSlideState";
import { useSlideStateMobile } from "@/app/hooks/useSlideStateMobile";
import useWindowPositionAndMobile from "@/app/hooks/useWindowPositionAndMobile";
import { CustomDrawer } from "@/components/mobile-menu";


import { cn } from "@/lib/utils";
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
      <div className="h-full w-full flex-col p-6 relative text-center z-20 ">
        {children}
      </div>
      {/* mobile menu */}
      {showCustomDrawer && <CustomDrawer />}

    </main>
  );
};

export default Wrapper;