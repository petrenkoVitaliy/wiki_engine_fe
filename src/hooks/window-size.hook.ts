import { useLayoutEffect, useState } from 'react';

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
