import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import Image from 'next/image';

import styles from './control-button.module.scss';

type ControlButtonProps = {
  handleClick: () => void;
  label: string;
  icon: StaticImport;
};

export function ControlButton({ handleClick, label, icon }: ControlButtonProps) {
  return (
    <button className={styles.buttonWrapper} onClick={handleClick} contentEditable={false}>
      <Image src={icon} alt={label} />
    </button>
  );
}
