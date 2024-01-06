import styles from './responsive-input.module.scss';
import { Input } from '../input/input';
import React, { useEffect, useRef, useState } from 'react';

type InputProps = React.ComponentProps<typeof Input> & {
  value: string;
  minWidth: number;
  maxWidth: number;
};

export function ResponsiveInput({ value, maxWidth, minWidth, ...inputProps }: InputProps) {
  const invisibleCopyRef = useRef<HTMLDivElement>(null);

  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (!invisibleCopyRef.current) {
      return;
    }

    invisibleCopyRef.current.innerText = value;
    const updatedWidth = invisibleCopyRef.current.clientWidth;

    setWidth(updatedWidth);
  }, [value]);

  return (
    <div className={styles.responsiveInputWrapper}>
      <Input
        {...inputProps}
        style={{
          width: `max(calc(${width}px + 20px), ${minWidth}px)`,
          maxWidth: `${maxWidth}px`,
        }}
      />
      <div className={styles.invisibleInputCopy} ref={invisibleCopyRef} />
    </div>
  );
}
