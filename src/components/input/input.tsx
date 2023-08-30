import { HTMLInputTypeAttribute } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';

import styles from './input.module.scss';

type InputProps<T extends string> = {
  formRegister: UseFormRegisterReturn<T>;
  type?: HTMLInputTypeAttribute;
};

export function Input<T extends string>({ formRegister, type }: InputProps<T>) {
  return <input className={styles.input} {...formRegister} type={type} />;
}
