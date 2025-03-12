import { useMediaQuery } from "react-responsive";

/**
 * Custom hook to detect if the current device is a mobile device
 * @returns boolean indicating if the device is mobile
 */
const useIsMobile = (): boolean => {
  const isMobile = useMediaQuery({
    maxWidth: 767,
  });

  return isMobile;
};

export default useIsMobile;