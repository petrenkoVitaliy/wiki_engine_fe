import { MouseEvent } from 'react';
import clsx from 'clsx';

import styles from './button.module.scss';

type ButtonProps = {
  label: string;
  type?: 'submit' | 'reset' | 'button';
  primary?: boolean;
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
};

export function Button({ type, primary, onClick, label }: ButtonProps) {
  return (
    <button
      type={type}
      className={clsx({
        [styles.button]: true,
        [styles.primary]: primary,
      })}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
