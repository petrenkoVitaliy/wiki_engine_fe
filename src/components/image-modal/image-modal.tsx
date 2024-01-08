import Image from 'next/image';
import { useCallback, useMemo, useState } from 'react';

import { ICONS } from '@/icons';

import { useWindowSizeRelation } from '@/hooks/window-size.hook';

import { Modal } from '../modal/modal';
import { ControlButton } from '../control-button/control-button';

import styles from './image-modal.module.scss';

type ModalImageProps = {
  url: string;
  alt: string;
  width: number;
  height: number;
  quality: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
};

const FULL_SIZE_RELATION = 90;

export function ImageModal(props: ModalImageProps) {
  const [isOpened, setIsOpened] = useState(false);

  const isAlbumOrientation = useWindowSizeRelation(props.width, props.height);

  const fullSize = useMemo(() => {
    if (isAlbumOrientation) {
      return {
        width: `${FULL_SIZE_RELATION}vw`,
        height: `calc(${FULL_SIZE_RELATION}vw / ${props.width} * ${props.height})`,
      };
    }

    return {
      height: `${FULL_SIZE_RELATION}vh`,
      width: `calc(${FULL_SIZE_RELATION}vh / ${props.height} * ${props.width})`,
    };
  }, [props, isAlbumOrientation]);

  const handleClose = useCallback(() => {
    setIsOpened(false);
  }, []);

  const handleOpen = useCallback(() => {
    setIsOpened(true);
  }, []);

  return (
    <>
      <Image
        src={props.url}
        alt={props.alt}
        width={props.width}
        height={props.height}
        placeholder={props.blurDataURL ? 'blur' : undefined}
        blurDataURL={props.blurDataURL}
        quality={props.quality}
        onClick={handleOpen}
        className={styles.image}
        priority
      />
      <Modal handleClickOutside={handleClose} isOpened={isOpened} fullScreen>
        <div className={styles.modalContent} style={fullSize}>
          <Image
            fill
            src={props.url}
            alt={props.alt}
            placeholder={props.blurDataURL ? 'blur' : undefined}
            blurDataURL={props.blurDataURL}
            quality={100}
          />
          <div className={styles.controls}>
            <ControlButton label='Close' onClick={handleClose} icon={ICONS.VERBOSE.closeIcon} />
          </div>
        </div>
      </Modal>
    </>
  );
}
