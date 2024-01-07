import { MouseEvent } from 'react';
import clsx from 'clsx';
import Image from 'next/image';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';

import { ElementFormat, VerboseBlockOptions } from '@/containers/wysiwyg/types';

import styles from './verbose-block-button.module.scss';
import { VerboseBlockPlaceholders } from '@/containers/wysiwyg/elements';

type BlockButtonProps = {
  format: ElementFormat;
  label: string;
  isBlockActive: boolean;
  icon: StaticImport;

  toggleVerboseBlock: (format: ElementFormat, options: VerboseBlockOptions) => void;
  handleOpenVerbosePrompt: (params: { format: string; placeholder: string }) => void;
};

export function VerboseBlockButton(props: BlockButtonProps) {
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (props.isBlockActive) {
      props.toggleVerboseBlock(props.format, {});
    } else {
      props.handleOpenVerbosePrompt({
        format: props.format,
        placeholder: VerboseBlockPlaceholders[props.format] || 'https://...',
      });
    }

    event.preventDefault();
  };

  return (
    <button
      className={clsx({
        [styles.verboseBlockButton]: true,
        [styles.active]: props.isBlockActive,
      })}
      onMouseDown={handleClick}
    >
      <Image src={props.icon} alt={props.label} />
    </button>
  );
}
