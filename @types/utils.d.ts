declare module "@/utils/useResponsiveSize" {
  interface ResponsiveSizeParams {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  }

  export default function useResponsiveSize(
    params?: ResponsiveSizeParams
  ): number;
}