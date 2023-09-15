import Image from 'next/image';
import clsx from 'clsx';
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
      className={clsx({
        [styles.markButton]: true,
        [styles.active]: props.isMarkActive,
      })}
      onMouseDown={(event) => {
        event.preventDefault();
        props.toggleMark(props.format);
      }}
    >
      <Image src={props.icon} alt={props.label} />
    </button>
  );
}
