import { HTMLInputTypeAttribute } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';

import styles from './input.module.scss';

type InputProps<T extends string> = {
  formRegister: UseFormRegisterReturn<T>;
  type?: HTMLInputTypeAttribute;
  disabled?: boolean;
};

export function Input<T extends string>({ formRegister, type, disabled }: InputProps<T>) {
  return <input disabled={disabled} className={styles.input} {...formRegister} type={type} />;
}
