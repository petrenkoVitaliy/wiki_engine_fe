import {
  ReactEditor,
  RenderElementProps,
  useFocused,
  useSelected,
  useSlateStatic,
} from 'slate-react';
import Image from 'next/image';

import { BlockEditorHandler } from '@/containers/wysiwyg/handlers/editor-handler/block-editor.handler';
import { ImageBlockElement } from '@/containers/wysiwyg/types';

import { ControlButton } from './control-button/control-button';

import { ICONS } from './icons';

import styles from './image-element.module.scss';
import { BACKGROUND_IMAGE } from './blur';

type ImageProps = Omit<RenderElementProps, 'element'> & {
  element: ImageBlockElement;
};

export function ImageElement({ attributes, children, element }: ImageProps) {
  const editor = useSlateStatic() as ReactEditor;
  const selected = useSelected();
  const focused = useFocused();

  const handleChangeSize = (direction: 'increase' | 'decrease') => {
    BlockEditorHandler.updateImageSize(editor, element, direction);
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
      className={`${styles.imageWrapper} ${selected && focused ? styles.selected : ''}`}
    >
      {children}
      <span className={styles.imageContainer} contentEditable={false}>
        <Image
          src={element.url}
          alt='inner image'
          width={element.width}
          height={element.height}
          placeholder='blur'
          blurDataURL={BACKGROUND_IMAGE}
          quality={100}
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
