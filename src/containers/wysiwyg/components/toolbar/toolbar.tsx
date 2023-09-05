import { StaticImport } from 'next/dist/shared/lib/get-img-props';

import { MarkButton } from './mark-button/mark-button';
import { BlockButton } from './block-button/block-button';
import { VerboseBlockButton } from './verbose-block-button/verbose-block-button';

import { ActiveElementsMap, ElementFormat, MarkFormat, VerboseBlockOptions } from '../../types';

import styles from './toolbar.module.scss';

type ToolbarProps = {
  activeElements: ActiveElementsMap;

  markButtons: { label: string; format: MarkFormat; icon: StaticImport }[];
  toggleMark: (format: MarkFormat) => void;

  blockButtons: { label: string; format: ElementFormat; icon: StaticImport }[];
  toggleBlock: (format: ElementFormat) => void;

  verboseBlockButtons: { label: string; format: ElementFormat; icon: StaticImport }[];
  toggleVerboseBlock: (format: ElementFormat, options: VerboseBlockOptions) => void;
};

export function Toolbar(props: ToolbarProps) {
  return (
    <div className={styles.toolbarWrapper}>
      {props.markButtons.map(({ label, format, icon }, i) => (
        <MarkButton
          icon={icon}
          key={i}
          label={label}
          format={format}
          toggleMark={props.toggleMark}
          isMarkActive={!!props.activeElements.activeMarks?.[format]}
        />
      ))}

      {props.blockButtons.map(({ label, format, icon }, i) => (
        <BlockButton
          icon={icon}
          key={i}
          label={label}
          format={format}
          toggleBlock={props.toggleBlock}
          isBlockActive={!!props.activeElements.activeBlocks[format]}
        />
      ))}

      {props.verboseBlockButtons.map(({ label, format, icon }, i) => (
        <VerboseBlockButton
          icon={icon}
          key={i}
          label={label}
          format={format}
          toggleVerboseBlock={props.toggleVerboseBlock}
          isBlockActive={!!props.activeElements.activeBlocks[format]}
        />
      ))}
    </div>
  );
}
