import Image from 'next/image';
import clsx from 'clsx';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';

import { ElementFormat } from '@/containers/wysiwyg/types';

import styles from './block-button.module.scss';

type BlockButtonProps = {
  format: ElementFormat;
  label: string;
  isBlockActive: boolean;
  icon: StaticImport;
  toggleBlock: (format: ElementFormat) => void;
};

export function BlockButton(props: BlockButtonProps) {
  return (
    <button
      className={clsx({
        [styles.blockButton]: true,
        [styles.active]: props.isBlockActive,
      })}
      onMouseDown={(event) => {
        event.preventDefault();
        props.toggleBlock(props.format);
      }}
    >
      <Image src={props.icon} alt={props.label} />
    </button>
  );
}
