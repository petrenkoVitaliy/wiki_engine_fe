import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import Image from 'next/image';

import styles from './control-button.module.scss';

type ControlButtonProps = {
  onClick: () => void;
  label: string;
  icon: StaticImport;
};

export function ControlButton({ onClick, label, icon }: ControlButtonProps) {
  return (
    <button className={styles.buttonWrapper} onClick={onClick} contentEditable={false}>
      <Image src={icon} alt={label} />
    </button>
  );
}
