import clsx from 'clsx';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import Image from 'next/image';

import styles from './control-button.module.scss';

type ControlButtonProps = {
  label: string;
  icon: StaticImport;

  onClick: () => void;

  labeled?: boolean;
};

export function ControlButton({ onClick, label, icon, labeled }: ControlButtonProps) {
  return (
    <button
      className={clsx(styles.buttonWrapper, { [styles.labeled]: labeled })}
      onClick={onClick}
      contentEditable={false}
    >
      {labeled && <span>{label}</span>}
      <Image src={icon} alt={label} />
    </button>
  );
}
