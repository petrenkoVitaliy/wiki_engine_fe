import { CSSProperties } from 'react';
import clsx from 'clsx';
import {
  ReactEditor,
  RenderElementProps,
  useFocused,
  useSelected,
  useSlateStatic,
} from 'slate-react';

import { YoutubeBlockElement } from '../../../types';

import styles from './video-element.module.scss';
import { ControlButton } from '../image-element/control-button/control-button';
import { BlockEditorHandler } from '@/containers/wysiwyg/handlers/editor-handler/block-editor.handler';
import { ICONS } from './icons';
import { BACKGROUND_IMAGE } from './blur';

type VideoElementProps = { style: CSSProperties } & Omit<RenderElementProps, 'element'> & {
    element: YoutubeBlockElement;
  };

const YOUTUBE_URN = 'https://www.youtube.com/embed';

export function VideoElement({ style, attributes, children, element }: VideoElementProps) {
  const editor = useSlateStatic() as ReactEditor;
  const selected = useSelected();
  const focused = useFocused();

  const handleChangeSize = (direction: 'increase' | 'decrease') => {
    BlockEditorHandler.updateVideoSize(editor, element, direction);
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
      style={style}
      {...attributes}
      className={clsx({
        [styles.videoWrapper]: true,
        [styles.selected]: selected && focused,
      })}
    >
      <span
        className={styles.videoContainer}
        style={{
          width: element.width,
          height: element.height,
        }}
        contentEditable={false}
      >
        <iframe
          style={{
            backgroundImage: `url('${BACKGROUND_IMAGE}')`,
            backgroundSize: 'cover',
          }}
          allow='fullscreen;'
          src={`${YOUTUBE_URN}/${element.videoKey}`}
          aria-label='youtube video'
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
      {children}
    </span>
  );
}
