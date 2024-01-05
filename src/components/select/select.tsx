import { UseFormRegisterReturn } from 'react-hook-form';

import styles from './select.module.scss';

type SelectProps<T extends string> = {
  options: { label: string; value: string | number }[];
  formRegister: UseFormRegisterReturn<T>;
  name: string;
  label?: string;
  onChange?: () => void;
  disabled?: boolean;
};

export function Select<T extends string>(props: SelectProps<T>) {
  return (
    <span className={styles.selectWrapper} onChange={props.onChange}>
      {props.label ? <span className={styles.label}>{props.label}</span> : null}
      <select {...props.formRegister} disabled={props.disabled} aria-label={props.name}>
        {props.options.map(({ label, value }) => (
          <option value={value} key={value}>
            {label}
          </option>
        ))}
      </select>
    </span>
  );
}
