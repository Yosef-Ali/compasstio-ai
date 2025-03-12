import { useMediaQuery } from "react-responsive";

/**
 * Custom hook to detect if the current device is a tablet
 * @returns boolean indicating if the device is a tablet
 */
const useIsTab = (): boolean => {
  const isTablet = useMediaQuery({
    minWidth: 768,
    maxWidth: 1223, // 991,
  });

  return isTablet;
};

export default useIsTab;