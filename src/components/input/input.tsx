import { HTMLInputTypeAttribute } from 'react';
import clsx from 'clsx';
import type { UseFormRegisterReturn } from 'react-hook-form';

import styles from './input.module.scss';

type InputProps<T extends string> = {
  formRegister: UseFormRegisterReturn<T>;
  name: string;
  type?: HTMLInputTypeAttribute;
  placeholder?: string;

  disabled?: boolean;
  hoverBorder?: boolean;
  highlighted?: boolean;
};

export function Input<T extends string>({
  formRegister,
  type,
  disabled,
  placeholder,
  highlighted,
  hoverBorder,
  name,
}: InputProps<T>) {
  return (
    <input
      disabled={disabled}
      placeholder={placeholder}
      className={clsx({
        [styles.input]: true,
        [styles.highlighted]: highlighted,
        [styles.hoverBorder]: hoverBorder,
      })}
      {...formRegister}
      type={type}
      autoComplete={name}
      aria-label={name}
    />
  );
}
