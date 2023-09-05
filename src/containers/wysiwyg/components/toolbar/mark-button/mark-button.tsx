import Image from 'next/image';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';

import { MarkFormat } from '@/containers/wysiwyg/types';

import styles from './mark-button.module.scss';

type MarkButtonProps = {
  format: MarkFormat;
  label: string;
  isMarkActive: boolean;
  icon: StaticImport;
  toggleMark: (format: MarkFormat) => void;
};

export function MarkButton(props: MarkButtonProps) {
  return (
    <button
      className={`${styles.markButton} ${props.isMarkActive ? styles.active : ''}`}
      onMouseDown={(event) => {
        event.preventDefault();
        props.toggleMark(props.format);
      }}
    >
      <Image src={props.icon} alt={props.label} />
    </button>
  );
}
