import { useMemo } from 'react';
import Image from 'next/image';
import { ReactEditor } from 'slate-react';
import { useForm } from 'react-hook-form';

import { BLUR_BACKGROUND_IMAGE } from '@/containers/wysiwyg/consts';

import { Select } from '@/components/select/select';
import { ControlButton } from '@/components/control-button/control-button';
import { ImageModal } from '@/components/image-modal/image-modal';

import { ICONS } from '@/icons';
import { VerboseBlockService } from '@/services/verbose-block/verbose-block.service';

import { TweetBlock, TwitterBlockElement } from '../../../types';

import styles from './tweet-element.module.scss';

type FormValues = { selectedVideoIndex: string | null };

type TweetItemProps = {
  item: TweetBlock;
  element: TwitterBlockElement;
  editor: ReactEditor;

  tweetIndex?: number;
  topElement?: boolean;
  label?: string;
  isThread?: boolean;
};

export function TweetItem({
  element,
  item,
  editor,
  tweetIndex,
  topElement,
  label,
  isThread,
}: TweetItemProps) {
  const videoVariantsOptions = useMemo(() => {
    return item.videoVariants.map((videoVariant, index) => ({
      value: index,
      label: `${videoVariant.qualityWidth} x ${videoVariant.qualityHeight}`,
    }));
  }, [item]);

  const { register, handleSubmit, watch } = useForm<FormValues>({
    values: {
      selectedVideoIndex: item.selectedVideoIndex !== null ? String(item.selectedVideoIndex) : null,
    },
  });

  const selectedVideoIndex = watch('selectedVideoIndex');

  const selectedVideoVariant = useMemo(() => {
    if (selectedVideoIndex !== null && item.videoVariants[+selectedVideoIndex]) {
      return item.videoVariants[+selectedVideoIndex];
    }

    return null;
  }, [item.videoVariants, selectedVideoIndex]);

  const onVideoIndexChange = (data: FormValues) => {
    if (data.selectedVideoIndex !== null) {
      VerboseBlockService.blockHandler['tweet'].updateSelectedVideoVariant(
        editor,
        element,
        +data.selectedVideoIndex
      );
    }
  };

  const handleChangeVideoSize = (direction: 'increase' | 'decrease') => {
    if (selectedVideoIndex !== null) {
      VerboseBlockService.blockHandler['tweet'].updateSelectedVideoVariantSize(
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
    if (tweetIndex === undefined) {
      return VerboseBlockService.blockHandler['tweet'].updatePhotoSize(
        editor,
        element,
        photoIndex,
        direction
      );
    }

    return VerboseBlockService.blockHandler['tweet'].updateThreadTweetPhotoSize(
      editor,
      element,
      photoIndex,
      tweetIndex,
      direction
    );
  };

  const handleIncreasePhotoSize = (photoIndex: number) => () => {
    handleChangePhotoSize('increase', photoIndex);
  };

  const handleDecreasePhotoSize = (photoIndex: number) => () => {
    handleChangePhotoSize('decrease', photoIndex);
  };

  return (
    <span className={styles.tweetContainer}>
      <span className={styles.labelWrapper}>
        <Image src={ICONS.WYSIWYG.twitterIcon} alt={'tweet'} />
        {isThread && <Image src={ICONS.BUTTON.threadIcon} alt={'tweet thread'} />}
        {topElement ? (
          <>
            <span className={styles.label}>Author:</span>
            <span className={styles.link}>
              <a href={item.source} target='_blank'>{` @${item.author}`}</a>
            </span>
          </>
        ) : (
          <>
            {label && <span className={styles.label}>{label}</span>}
            <span className={styles.link}>
              <a href={item.source} target='_blank'>
                source
              </a>
            </span>
          </>
        )}
      </span>

      <span className={styles.message}>{item.message}</span>
      <br />

      {selectedVideoVariant && (
        <span className={styles.videoContainer}>
          <video loop controls width={item.videoWidth} key={selectedVideoVariant.url}>
            <source src={selectedVideoVariant.url} type={selectedVideoVariant.type} />
          </video>
          <span className={styles.videoControlsWrapper} contentEditable={false}>
            <span className={styles.videoControlsButtons}>
              <ControlButton
                icon={ICONS.VERBOSE.plusIcon}
                label='increase video size'
                onClick={handleIncreaseVideoSize}
              />
              <ControlButton
                icon={ICONS.VERBOSE.minusIcon}
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
        {item.photos.map((photo, index) => (
          <span className={styles.photoContainer} key={index}>
            <ImageModal
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
                icon={ICONS.VERBOSE.plusIcon}
                label='increase image size'
                onClick={handleIncreasePhotoSize(index)}
              />
              <ControlButton
                icon={ICONS.VERBOSE.minusIcon}
                label='decrease image size'
                onClick={handleDecreasePhotoSize(index)}
              />
            </span>
          </span>
        ))}
      </span>
    </span>
  );
}
