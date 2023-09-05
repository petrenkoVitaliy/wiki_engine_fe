import { useMemo } from 'react';

import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';

export function useTruthSource<T>(params: {
  propSource: T;
  storeSelector: (state: RootState) => T;
}): T {
  const storeSource = useAppSelector(params.storeSelector);

  const source = useMemo(() => storeSource || params.propSource, [params, storeSource]);

  return source;
}
