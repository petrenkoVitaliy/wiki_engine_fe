import { MouseEvent, useRef } from 'react';
import styles from './modal.module.scss';

type ModalProps = {
  children: React.ReactNode;
  handleClickOutside: () => void;
};

export function Modal(props: ModalProps) {
  const overlayRef = useRef(null);

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) {
      props.handleClickOutside();
    }
  };

  return (
    <div className={styles.overlay} ref={overlayRef} onClick={handleClick}>
      <div className={styles.container}>{props.children}</div>
    </div>
  );
}
