import { useRef } from 'react';

export function useDebounce<T>(callback: (value: T) => void, delay: number) {
  const currentValue = useRef<T | null>(null);
  const actualTimer = useRef<NodeJS.Timeout | null>(null);

  const handleTimeout = () => {
    if (currentValue.current !== null) {
      callback(currentValue.current);
    }
  };

  const debounce = (value?: T | null) => {
    if (actualTimer.current) {
      clearTimeout(actualTimer.current);
    }

    if (!value) {
      return;
    }

    actualTimer.current = setTimeout(handleTimeout, delay);
    currentValue.current = value;
  };

  return debounce;
}
