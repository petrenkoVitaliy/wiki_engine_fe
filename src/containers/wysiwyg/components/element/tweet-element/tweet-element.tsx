import { CSSProperties, useMemo } from 'react';
import Image from 'next/image';
import {
  ReactEditor,
  RenderElementProps,
  useFocused,
  useSelected,
  useSlateStatic,
} from 'slate-react';
import { useForm } from 'react-hook-form';
import clsx from 'clsx';

import { BlockEditorHandler } from '@/containers/wysiwyg/handlers/editor-handler/block-editor.handler';
import { BLUR_BACKGROUND_IMAGE } from '@/containers/wysiwyg/consts';

import { Select } from '@/components/select/select';
import { ControlButton } from '@/components/control-button/control-button';
import { ModalImage } from '@/components/modal-image/modal-image';

import { VerboseBlockService } from '@/services/verbose-block/verbose-block.service';

import { TwitterBlockElement } from '../../../types';

import { ICONS } from './icons';

import twitterIcon from '@/icons/twitter.svg';
import styles from './tweet-element.module.scss';

type FormValues = { selectedVideoIndex: string | null };

type TweetElementProps = { style: CSSProperties } & Omit<RenderElementProps, 'element'> & {
    element: TwitterBlockElement;
  };

export function TweetElement({ style, attributes, children, element }: TweetElementProps) {
  const editor = useSlateStatic() as ReactEditor;
  const selected = useSelected();
  const focused = useFocused();

  const videoVariantsOptions = useMemo(() => {
    return element.videoVariants.map((videoVariant, index) => ({
      value: index,
      label: `${videoVariant.qualityWidth} x ${videoVariant.qualityHeight}`,
    }));
  }, [element]);

  const { register, handleSubmit, watch } = useForm<FormValues>({
    values: {
      selectedVideoIndex:
        element.selectedVideoIndex !== null ? String(element.selectedVideoIndex) : null,
    },
  });

  const selectedVideoIndex = watch('selectedVideoIndex');

  const selectedVideoVariant = useMemo(() => {
    if (selectedVideoIndex !== null && element.videoVariants[+selectedVideoIndex]) {
      return element.videoVariants[+selectedVideoIndex];
    }

    return null;
  }, [element.videoVariants, selectedVideoIndex]);

  const onVideoIndexChange = (data: FormValues) => {
    if (data.selectedVideoIndex !== null) {
      VerboseBlockService.blockHandler['twitter'].updateSelectedVideoVariant(
        editor,
        element,
        +data.selectedVideoIndex
      );
    }
  };

  const handleChangeVideoSize = (direction: 'increase' | 'decrease') => {
    if (selectedVideoIndex !== null) {
      VerboseBlockService.blockHandler['twitter'].updateSelectedVideoVariantSize(
        editor,
        element,
        direction
      );
    }
  };

  const handleIncreaseVideoSize = () => {
    handleChangeVideoSize('increase');
  };

  const handleDecreaseVideoSize = () => {
    handleChangeVideoSize('decrease');
  };

  const handleChangePhotoSize = (direction: 'increase' | 'decrease', photoIndex: number) => {
    VerboseBlockService.blockHandler['twitter'].updatePhotoSize(
      editor,
      element,
      photoIndex,
      direction
    );
  };

  const handleIncreasePhotoSize = (photoIndex: number) => () => {
    handleChangePhotoSize('increase', photoIndex);
  };

  const handleDecreasePhotoSize = (photoIndex: number) => () => {
    handleChangePhotoSize('decrease', photoIndex);
  };

  const handleRemoveTweet = () => {
    BlockEditorHandler.removeNode(editor, element);
  };

  return (
    <span
      style={style}
      {...attributes}
      className={clsx({
        [styles.tweetWrapper]: true,
        [styles.selected]: selected && focused,
      })}
    >
      {children}

      <span className={styles.tweetContainer}>
        <span className={styles.labelWrapper}>
          <Image src={twitterIcon} alt={'tweet'} />
          <span className={styles.label}>Author:</span>
          <span className={styles.link}>
            <a href={element.source} target='_blank'>{`@${element.author}`}</a>
          </span>
        </span>

        <span className={styles.message}>{element.message}</span>
        <br />

        {selectedVideoVariant && (
          <span className={styles.videoContainer}>
            <video loop controls width={element.videoWidth} key={selectedVideoVariant.url}>
              <source src={selectedVideoVariant.url} type={selectedVideoVariant.type} />
            </video>
            <span className={styles.videoControlsWrapper} contentEditable={false}>
              <span className={styles.videoControlsButtons}>
                <ControlButton
                  icon={ICONS.plusIcon}
                  label='increase video size'
                  onClick={handleIncreaseVideoSize}
                />
                <ControlButton
                  icon={ICONS.minusIcon}
                  label='decrease video size'
                  onClick={handleDecreaseVideoSize}
                />
              </span>

              <Select
                formRegister={register('selectedVideoIndex')}
                onChange={handleSubmit(onVideoIndexChange)}
                options={videoVariantsOptions}
                label='Quality:'
                name='quality'
              />
            </span>
          </span>
        )}

        <span className={styles.photosWrapper}>
          {element.photos.map((photo, index) => (
            <span className={styles.photoContainer} key={index}>
              <ModalImage
                url={photo.url}
                alt='tweet image'
                width={photo.width}
                height={photo.height}
                placeholder='blur'
                blurDataURL={BLUR_BACKGROUND_IMAGE}
                quality={75}
              />
              <span className={styles.photoControlsWrapper} contentEditable={false}>
                <ControlButton
                  icon={ICONS.plusIcon}
                  label='increase image size'
                  onClick={handleIncreasePhotoSize(index)}
                />
                <ControlButton
                  icon={ICONS.minusIcon}
                  label='decrease image size'
                  onClick={handleDecreasePhotoSize(index)}
                />
              </span>
            </span>
          ))}
        </span>

        <span className={styles.controlsWrapper} contentEditable={false}>
          <ControlButton icon={ICONS.deleteIcon} label='remove image' onClick={handleRemoveTweet} />
        </span>
      </span>
    </span>
  );
}
