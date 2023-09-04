import { useCallback, useState } from 'react';

export function useModalControls() {
  const [isOpened, setIsOpened] = useState(false);

  const handleOpenModal = useCallback(() => setIsOpened(true), []);
  const handleCloseModal = useCallback(() => setIsOpened(false), []);

  return {
    isOpened,
    handleOpenModal,
    handleCloseModal,
  };
}
