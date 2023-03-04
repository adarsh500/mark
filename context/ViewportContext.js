import { createContext, useContext, useLayoutEffect, useState } from 'react';

const viewportContext = createContext({});

export const ViewportProvider = ({ children }) => {
  const isSSR = typeof window === 'undefined';

  if (isSSR) {
    return null;
  }

  const [width, setWidth] = useState(isSSR ? null : window.innerWidth);
  const handleWindowResize = () => {
    setWidth(window.innerWidth);
  };

  useLayoutEffect(() => {
    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, []);

  return (
    <viewportContext.Provider value={{ isMobile: width <= 1024 }}>
      {children}
    </viewportContext.Provider>
  );
};

export const useIsMobile = () => useContext(viewportContext);

export const useViewport = () => {
  const { width } = useContext(viewportContext);
  return { width };
};
