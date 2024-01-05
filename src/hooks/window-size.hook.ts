import { useLayoutEffect, useState } from 'react';

export function useWindowSize() {
  const [size, setSize] = useState([0, 0]);

  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }

    window.addEventListener('resize', updateSize);
    updateSize();

    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return size;
}

export function useWindowSizeRelation(childWidth: number, childHeight: number) {
  const [isAlbumOrientation, setIsAlbumOrientation] = useState(true);

  useLayoutEffect(() => {
    function updateSize() {
      setIsAlbumOrientation(window.innerWidth / childWidth < window.innerHeight / childHeight);
    }

    window.addEventListener('resize', updateSize);
    updateSize();

    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return isAlbumOrientation;
}
