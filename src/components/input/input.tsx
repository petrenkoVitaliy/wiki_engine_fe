import { HTMLInputTypeAttribute } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';

import styles from './input.module.scss';

type InputProps<T extends string> = {
  formRegister: UseFormRegisterReturn<T>;
  type?: HTMLInputTypeAttribute;
  placeholder?: string;

  disabled?: boolean;
  highlighted?: boolean;
};

export function Input<T extends string>({
  formRegister,
  type,
  disabled,
  placeholder,
  highlighted,
}: InputProps<T>) {
  return (
    <input
      disabled={disabled}
      placeholder={placeholder}
      className={`${styles.input} ${highlighted ? styles.highlighted : ''}`}
      {...formRegister}
      type={type}
    />
  );
}
