import React from 'react';

export default function useWindowSize() {
  const isSSR = typeof window === 'undefined';
  const [width, setWidth] = React.useState(isSSR ? null : window.innerWidth);

  React.useEffect(() => {
    window.addEventListener('resize', changeWindowSize);

    return () => {
      window.removeEventListener('resize', changeWindowSize);
    };
  }, []);

  function changeWindowSize() {
    setWidth(window.innerWidth);
  }

  return width <= 1024;
}
