import { HTMLInputTypeAttribute } from 'react';
import clsx from 'clsx';
import type { UseFormRegisterReturn, FieldError, Merge, FieldErrorsImpl } from 'react-hook-form';

import { Input } from '../input/input';

import styles from './labeled-input.module.scss';

type InputProps<T extends string> = {
  formRegister: UseFormRegisterReturn<T>;
  error: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
  label: string;
  hoverBorder?: boolean;
  type?: HTMLInputTypeAttribute;
};

export function LabeledInput<T extends string>(props: InputProps<T>) {
  const getErrorMessage = (
    error: FieldError | Merge<FieldError, FieldErrorsImpl<any>>
  ): string | undefined => {
    return error?.message as string | undefined;
  };

  return (
    <div
      className={clsx({
        [styles.inputWrapper]: true,
        [styles.error]: props.error,
      })}
    >
      <p className={styles.label}>{props.label}</p>
      <Input
        formRegister={props.formRegister}
        type={props.type}
        hoverBorder={props.hoverBorder}
        name={props.label}
      />
      {props.error && <p className={styles.errorLabel}>{getErrorMessage(props.error)}</p>}
    </div>
  );
}
