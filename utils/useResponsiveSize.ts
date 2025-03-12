import { useMediaQuery, useTheme } from "@material-ui/core";

/**
 * Custom hook to provide responsive sizing based on screen breakpoints
 * @param {Object} params - Size parameters for different breakpoints
 * @param {number} params.xs - Size for extra small screens
 * @param {number} params.sm - Size for small screens
 * @param {number} params.md - Size for medium screens
 * @param {number} params.lg - Size for large screens
 * @param {number} params.xl - Size for extra large screens
 * @returns {number} The appropriate size value for the current screen size
 */
interface ResponsiveSizeParams {
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
}

const useResponsiveSize = (params: ResponsiveSizeParams = {}): number => {
  const { xs = 0, sm = 0, md = 0, lg = 0, xl = 0 } = params;
  const theme = useTheme();
  const gtThenXS = useMediaQuery(theme.breakpoints.up("xs"));
  const gtThenSM = useMediaQuery(theme.breakpoints.up("sm"));
  const gtThenMD = useMediaQuery(theme.breakpoints.up("md"));
  const gtThenLG = useMediaQuery(theme.breakpoints.up("lg"));
  const gtThenXL = useMediaQuery(theme.breakpoints.up("xl"));

  return gtThenXL
    ? xl
    : gtThenLG
    ? lg
    : gtThenMD
    ? md
    : gtThenSM
    ? sm
    : gtThenXS
    ? xs
    : lg;
};

export default useResponsiveSize;