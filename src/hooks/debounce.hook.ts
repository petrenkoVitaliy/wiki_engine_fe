import { useRef } from 'react';

export function useDebounce<T>(callback: (value: T | null) => void, delay: number) {
  const currentValue = useRef<T | null>(null);
  const actualTimer = useRef<NodeJS.Timeout | null>(null);

  const handleTimeout = () => {
    callback(currentValue.current);
  };

  return (value?: T | null) => {
    if (actualTimer.current) {
      clearTimeout(actualTimer.current);
    }

    if (!value) {
      if (!currentValue.current) {
        return;
      }

      currentValue.current = null;
      actualTimer.current = null;

      handleTimeout();

      return;
    }

    actualTimer.current = setTimeout(handleTimeout, delay);
    currentValue.current = value;
  };
}
