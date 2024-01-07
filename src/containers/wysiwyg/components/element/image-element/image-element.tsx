import {
  ReactEditor,
  RenderElementProps,
  useFocused,
  useSelected,
  useSlateStatic,
} from 'slate-react';
import clsx from 'clsx';

import { BlockEditorHandler } from '@/containers/wysiwyg/handlers/editor-handler/block-editor.handler';
import { ImageBlockElement } from '@/containers/wysiwyg/types';
import { BLUR_BACKGROUND_IMAGE } from '@/containers/wysiwyg/consts';

import { ControlButton } from '@/components/control-button/control-button';
import { ImageModal } from '@/components/image-modal/image-modal';

import { ICONS } from '@/icons';
import { VerboseBlockService } from '@/services/verbose-block/verbose-block.service';

import styles from './image-element.module.scss';

type ImageProps = Omit<RenderElementProps, 'element'> & {
  element: ImageBlockElement;
};

export function ImageElement({ attributes, children, element }: ImageProps) {
  const editor = useSlateStatic() as ReactEditor;
  const selected = useSelected();
  const focused = useFocused();

  const handleChangeSize = (direction: 'increase' | 'decrease') => {
    VerboseBlockService.blockHandler['image'].updateImageSize(editor, element, direction);
  };

  const handleIncreaseSize = () => {
    handleChangeSize('increase');
  };

  const handleDecreaseSize = () => {
    handleChangeSize('decrease');
  };

  const handleRemoveImage = () => {
    BlockEditorHandler.removeNode(editor, element);
  };

  return (
    <span
      {...attributes}
      className={clsx({
        [styles.imageWrapper]: true,
        [styles.selected]: selected && focused,
      })}
    >
      {children}
      <span className={styles.imageContainer} contentEditable={false}>
        <ImageModal
          url={element.url}
          alt='inner image'
          width={element.width}
          height={element.height}
          placeholder='blur'
          blurDataURL={BLUR_BACKGROUND_IMAGE}
          quality={80}
        />
      </span>
      <span className={styles.controlsWrapper} contentEditable={false}>
        <ControlButton icon={ICONS.deleteIcon} label='remove image' onClick={handleRemoveImage} />
        <ControlButton
          icon={ICONS.plusIcon}
          label='increase image size'
          onClick={handleIncreaseSize}
        />
        <ControlButton
          icon={ICONS.minusIcon}
          label='decrease image size'
          onClick={handleDecreaseSize}
        />
      </span>
    </span>
  );
}
