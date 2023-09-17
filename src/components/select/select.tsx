import { UseFormRegisterReturn } from 'react-hook-form';

import styles from './select.module.scss';

type SelectProps<T extends string> = {
  options: { label: string; value: string }[];
  formRegister: UseFormRegisterReturn<T>;
  label?: string;
  onChange?: () => void;
  disabled?: boolean;
};

export function Select<T extends string>(props: SelectProps<T>) {
  return (
    <div className={styles.selectWrapper} onChange={props.onChange}>
      {props.label ? <div className={styles.label}>{props.label}</div> : null}
      <select {...props.formRegister} disabled={props.disabled}>
        {props.options.map(({ label, value }) => (
          <option value={value} key={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}
