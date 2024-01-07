import { CSSProperties, HTMLInputTypeAttribute } from 'react';
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form';
import clsx from 'clsx';

import styles from './input.module.scss';

type InputProps<T extends FieldValues = FieldValues, TName extends FieldPath<T> = FieldPath<T>> = {
  control: Control<T>;
  name: TName;
  ariaName: string;

  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  style?: CSSProperties;

  disabled?: boolean;
  hoverBorder?: boolean;
  highlighted?: boolean;
};

export function ControlledInput<
  T extends FieldValues = FieldValues,
  TName extends FieldPath<T> = FieldPath<T>,
>({
  control,
  type,
  disabled,
  placeholder,
  highlighted,
  hoverBorder,
  name,
  style,
  ariaName,
}: InputProps<T, TName>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <input
          {...field}
          disabled={disabled}
          placeholder={placeholder}
          className={clsx({
            [styles.input]: true,
            [styles.highlighted]: highlighted,
            [styles.hoverBorder]: hoverBorder,
          })}
          type={type}
          autoComplete={name}
          aria-label={ariaName}
          style={style}
        />
      )}
    />
  );
}
