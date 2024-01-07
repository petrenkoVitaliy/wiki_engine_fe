import clsx from 'clsx';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';

import { MarkButton } from './mark-button/mark-button';
import { BlockButton } from './block-button/block-button';
import { VerboseBlockButton } from './verbose-block-button/verbose-block-button';

import { ActiveElementsMap, ElementFormat, MarkFormat, VerboseBlockOptions } from '../../types';

import styles from './toolbar.module.scss';

type ToolbarProps = {
  isHidden?: boolean;

  activeElements: ActiveElementsMap;

  markButtons: { label: string; format: MarkFormat; icon: StaticImport }[];
  toggleMark: (format: MarkFormat) => void;

  blockButtons: { label: string; format: ElementFormat; icon: StaticImport }[];
  toggleBlock: (format: ElementFormat) => void;

  verboseBlockButtons: { label: string; format: ElementFormat; icon: StaticImport }[];
  toggleVerboseBlock: (format: ElementFormat, options: VerboseBlockOptions) => void;

  handleOpenVerbosePrompt: (params: { format: string; placeholder: string }) => void;
};

export function Toolbar(props: ToolbarProps) {
  return (
    <div
      className={clsx({
        [styles.toolbarWrapper]: true,
        [styles.hidden]: props.isHidden,
      })}
    >
      <MarkButtonsList
        markButtons={props.markButtons}
        toggleMark={props.toggleMark}
        activeElements={props.activeElements}
      />

      <BlockButtonsList
        blockButtons={props.blockButtons}
        toggleBlock={props.toggleBlock}
        activeElements={props.activeElements}
      />

      <VerboseBlocksList
        verboseBlockButtons={props.verboseBlockButtons}
        toggleVerboseBlock={props.toggleVerboseBlock}
        activeElements={props.activeElements}
        handleOpenVerbosePrompt={props.handleOpenVerbosePrompt}
      />
    </div>
  );
}

function MarkButtonsList(
  props: Pick<ToolbarProps, 'markButtons' | 'toggleMark' | 'activeElements'>
) {
  return (
    <>
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
    </>
  );
}

function BlockButtonsList(
  props: Pick<ToolbarProps, 'blockButtons' | 'toggleBlock' | 'activeElements'>
) {
  return (
    <>
      {props.blockButtons.map(({ label, format, icon }) => (
        <BlockButton
          icon={icon}
          key={label}
          label={label}
          format={format}
          toggleBlock={props.toggleBlock}
          isBlockActive={!!props.activeElements.activeBlocks[format]}
        />
      ))}
    </>
  );
}

function VerboseBlocksList(
  props: Pick<
    ToolbarProps,
    'verboseBlockButtons' | 'toggleVerboseBlock' | 'activeElements' | 'handleOpenVerbosePrompt'
  >
) {
  return (
    <>
      {props.verboseBlockButtons.map(({ label, format, icon }) => (
        <VerboseBlockButton
          icon={icon}
          key={label}
          label={label}
          format={format}
          isBlockActive={!!props.activeElements.activeBlocks[format]}
          toggleVerboseBlock={props.toggleVerboseBlock}
          handleOpenVerbosePrompt={props.handleOpenVerbosePrompt}
        />
      ))}
    </>
  );
}
