import { HTMLInputTypeAttribute } from 'react';
import type { UseFormRegisterReturn, FieldError, Merge, FieldErrorsImpl } from 'react-hook-form';

import { Input } from '../input/input';

import styles from './labeled-input.module.scss';

type InputProps<T extends string> = {
  formRegister: UseFormRegisterReturn<T>;
  error: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
  label: string;
  type?: HTMLInputTypeAttribute;
};

export function LabeledInput<T extends string>(props: InputProps<T>) {
  const getErrorMessage = (error: FieldError | Merge<FieldError, FieldErrorsImpl<any>>): string => {
    console.log(error);
    return error.message as string;
  };

  return (
    <div className={`${styles.inputWrapper} ${props.error ? styles.error : ''}`}>
      <p className={styles.label}>{props.label}</p>
      <Input formRegister={props.formRegister} type={props.type} />
      {props.error && <div className={styles.errorLabel}>{getErrorMessage(props.error)}</div>}
    </div>
  );
}
