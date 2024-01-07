import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form';

import styles from './select.module.scss';
import clsx from 'clsx';

type SelectProps<T extends FieldValues = FieldValues, TName extends FieldPath<T> = FieldPath<T>> = {
  options: { label: string; value: string | number }[];
  name: TName;
  ariaName: string;

  control: Control<T>;

  label?: string;
  className?: string;
  onChange?: () => void;
  disabled?: boolean;
};

export function ControlledSelect<
  T extends FieldValues = FieldValues,
  TName extends FieldPath<T> = FieldPath<T>,
>(props: SelectProps<T, TName>) {
  return (
    <span
      className={clsx({
        ...(props.className ? { [props.className]: true } : null),
        [styles.selectWrapper]: true,
      })}
      onChange={props.onChange}
    >
      {props.label ? <span className={styles.label}>{props.label}</span> : null}
      <Controller
        control={props.control}
        name={props.name}
        render={({ field }) => (
          <select {...field} disabled={props.disabled} aria-label={props.ariaName}>
            {props.options.map(({ label, value }) => (
              <option value={value} key={value}>
                {label}
              </option>
            ))}
          </select>
        )}
      />
    </span>
  );
}
