import Image from 'next/image';
import { useState } from 'react';

import { ICONS } from '@/containers/wysiwyg/components/toolbar/icons';

import { Modal } from '../modal/modal';
import { ControlButton } from '../control-button/control-button';

import styles from './modal-image.module.scss';

type ModalImageProps = {
  url: string;
  alt: string;
  width: number;
  height: number;
  quality: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
};

export function ModalImage(props: ModalImageProps) {
  const [isOpened, setIsOpened] = useState(false);

  const handleClose = () => {
    setIsOpened(false);
  };

  const handleOpen = () => {
    setIsOpened(true);
  };

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
        <div className={styles.modalContent}>
          <Image
            fill
            src={props.url}
            alt={props.alt}
            placeholder={props.blurDataURL ? 'blur' : undefined}
            blurDataURL={props.blurDataURL}
            quality={props.quality}
          />
        </div>
        <div className={styles.controls}>
          <ControlButton label='Close' onClick={handleClose} icon={ICONS.closeIcon} />
        </div>
      </Modal>
    </>
  );
}
