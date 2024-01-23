import { CSSProperties } from 'react';
import clsx from 'clsx';
import {
  ReactEditor,
  RenderElementProps,
  useFocused,
  useSelected,
  useSlateStatic,
} from 'slate-react';

import { BLUR_BACKGROUND_IMAGE } from '@/containers/wysiwyg/consts';
import { ControlButton } from '@/components/control-button/control-button';
import { VerboseBlockService } from '@/services/verbose-block/verbose-block.service';

import { YoutubeBlockElement } from '../../../types';

import { ICONS } from '@/icons';
import styles from './video-element.module.scss';

type VideoElementProps = { style: CSSProperties } & Omit<RenderElementProps, 'element'> & {
    element: YoutubeBlockElement;
  };

const YOUTUBE_URN = 'https://www.youtube.com/embed';

export function VideoElement({ style, attributes, children, element }: VideoElementProps) {
  const editor = useSlateStatic() as ReactEditor;
  const selected = useSelected();
  const focused = useFocused();

  const handleChangeSize = (direction: 'increase' | 'decrease') => {
    VerboseBlockService.blockHandler['youtube'].updateVideoSize(editor, element, direction);
  };

  const handleIncreaseSize = () => {
    handleChangeSize('increase');
  };

  const handleDecreaseSize = () => {
    handleChangeSize('decrease');
  };

  const handleRemoveImage = () => {
    VerboseBlockService.blockHandler['youtube'].removeNode(editor, element);
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
            backgroundImage: `url('${BLUR_BACKGROUND_IMAGE}')`,
            backgroundSize: 'cover',
          }}
          allow='fullscreen;'
          src={`${YOUTUBE_URN}/${element.videoKey}`}
          aria-label='youtube video'
        />
      </span>
      <span className={styles.controlsWrapper} contentEditable={false}>
        <ControlButton
          icon={ICONS.VERBOSE.deleteIcon}
          label='remove image'
          onClick={handleRemoveImage}
        />
        <ControlButton
          icon={ICONS.VERBOSE.plusIcon}
          label='increase image size'
          onClick={handleIncreaseSize}
        />
        <ControlButton
          icon={ICONS.VERBOSE.minusIcon}
          label='decrease image size'
          onClick={handleDecreaseSize}
        />
      </span>
      {children}
    </span>
  );
}
