import React, { useEffect, useRef, useState } from 'react';

import styles from './responsive-input.module.scss';
import { Input } from '../input/input';

type InputProps = React.ComponentProps<typeof Input> & {
  value: string;
  minWidth: number;
  maxWidth: number;
};

export function ResponsiveInput({ value, maxWidth, minWidth, ...inputProps }: InputProps) {
  const invisibleCopyRef = useRef<HTMLDivElement>(null);

  const [dynamicStyle, setDynamicStyle] = useState<React.CSSProperties | undefined>();

  useEffect(() => {
    if (!invisibleCopyRef.current) {
      return;
    }

    invisibleCopyRef.current.innerText = value;
    const updatedWidth = invisibleCopyRef.current.clientWidth;

    setDynamicStyle({
      width: `max(calc(${updatedWidth}px + 20px), ${minWidth}px)`,
      maxWidth: `${maxWidth}px`,
    });
  }, [value]);

  return (
    <div className={styles.responsiveInputWrapper}>
      <Input {...inputProps} style={dynamicStyle} />
      <div className={styles.invisibleInputCopy} ref={invisibleCopyRef} />
    </div>
  );
}
