import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';

const useKeyPress = (keys, callback, node = null) => {
  // implement the callback ref pattern
  const callbackRef = useRef(callback);
  useLayoutEffect(() => {
    callbackRef.current = callback;
  });

  // handle what happens on key press
  const handleKeyPress = useCallback(
    (event) => {
      if (keys.some((key) => event.key === key)) {
        if (modifier === 'ctrl' && event.ctrlKey) {
          event.preventDefault();
          callbackRef.current(event);
        }
      }
    },
    [keys]
  );

  useEffect(() => {
    // target is either the provided node or the document
    const targetNode = node ?? document;
    // attach the event listener
    targetNode && targetNode.addEventListener('keydown', handleKeyPress);

    // remove the event listener
    return () =>
      targetNode && targetNode.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress, node]);
};

export { useKeyPress };
