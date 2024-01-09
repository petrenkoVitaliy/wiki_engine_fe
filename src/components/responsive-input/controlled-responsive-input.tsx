import React, { useEffect, useRef, useState } from 'react';
import { FieldPath, FieldValues } from 'react-hook-form';

import { ControlledInput } from '../input/controlled-input';

import styles from './responsive-input.module.scss';

type InputProps<
  T extends FieldValues = FieldValues,
  TName extends FieldPath<T> = FieldPath<T>,
> = React.ComponentProps<typeof ControlledInput<T, TName>> & {
  value: string;
  minWidth: number;
  maxWidth: number;
};

export function ControlledResponsiveInput<
  T extends FieldValues = FieldValues,
  TName extends FieldPath<T> = FieldPath<T>,
>({ value, maxWidth, minWidth, ...inputProps }: InputProps<T, TName>) {
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
      <ControlledInput {...inputProps} style={dynamicStyle} />
      <div className={styles.invisibleInputCopy} ref={invisibleCopyRef} />
    </div>
  );
}
