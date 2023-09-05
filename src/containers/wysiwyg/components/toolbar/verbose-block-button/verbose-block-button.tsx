import { MouseEvent } from 'react';
import Image from 'next/image';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';

import { ElementFormat, VerboseBlockOptions } from '@/containers/wysiwyg/types';

import styles from './verbose-block-button.module.scss';

type BlockButtonProps = {
  format: ElementFormat;
  label: string;
  toggleVerboseBlock: (format: ElementFormat, options: VerboseBlockOptions) => void;
  isBlockActive: boolean;
  icon: StaticImport;
};

export function VerboseBlockButton(props: BlockButtonProps) {
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (props.isBlockActive) {
      props.toggleVerboseBlock(props.format, {});
    } else {
      const url = prompt('url?'); // TODO

      if (url) {
        props.toggleVerboseBlock(props.format, { url });
      }
    }

    event.preventDefault();
  };

  return (
    <button
      className={`${styles.verboseBlockButton} ${props.isBlockActive ? styles.active : ''}`}
      onMouseDown={handleClick}
    >
      <Image src={props.icon} alt={props.label} />
    </button>
  );
}
