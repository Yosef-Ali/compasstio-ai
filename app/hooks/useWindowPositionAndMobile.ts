import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

function useWindowPositionAndMobile() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Define your media queries and breakpoints
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const isTablet = useMediaQuery({ query: '(min-width: 769px) and (max-width: 1024px)' });
  const isDesktop = useMediaQuery({ query: '(min-width: 1025px)' });

  useEffect(() => {
    const updateWindowPosition = () => {
      const x = window.screenX || window.screenLeft || 0;
      const y = window.screenY || window.screenTop || 0;
      setPosition({ x, y });
    };

    updateWindowPosition();

    window.addEventListener('move', updateWindowPosition);

    return () => {
      window.removeEventListener('move', updateWindowPosition);
    };
  }, []);

  return { position, isMobile, isTablet, isDesktop };
}

export default useWindowPositionAndMobile;
