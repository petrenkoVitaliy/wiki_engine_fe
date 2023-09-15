import { useCallback, useState } from 'react';

export function usePromptModalControls<T>() {
  const [promptParams, setPromptParams] = useState<T | null>(null);

  const handleOpenModal = useCallback((params: T) => setPromptParams(params), []);
  const handleCloseModal = useCallback(() => setPromptParams(null), []);

  return {
    promptParams,
    handleOpenModal,
    handleCloseModal,
  };
}
