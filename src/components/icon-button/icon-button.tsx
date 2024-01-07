import { MouseEvent } from 'react';
import clsx from 'clsx';

import { StaticImport } from 'next/dist/shared/lib/get-img-props';

import styles from './icon-button.module.scss';
import Image from 'next/image';

type IconButtonProps = {
  label: string;
  icon: StaticImport;

  collapsable?: boolean;
  simple?: boolean;

  type?: 'submit' | 'reset' | 'button';
  size?: number;
  primary?: boolean;
  className?: string;

  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
};

const DEFAULT_SIZE = 20;

export function IconButton({
  type,
  primary,
  onClick,
  label,
  icon,
  size,
  collapsable,
  simple,
  className,
}: IconButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={clsx({
        ...(className ? { [className]: true } : null),
        [styles.button]: true,
        [styles.primary]: primary,
        [styles.collapsable]: collapsable,
        [styles.simple]: simple,
      })}
    >
      <span className={styles.label}>{label}</span>
      <Image
        className={clsx({ [styles.image]: true })}
        src={icon}
        alt={label}
        width={size || DEFAULT_SIZE}
        height={size || DEFAULT_SIZE}
      />
    </button>
  );
}
