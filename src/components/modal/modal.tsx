import { MouseEvent, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';

import styles from './modal.module.scss';

type ModalProps = {
  fullScreen?: boolean;
  isOpened: boolean;
  children: React.ReactNode;
  handleClickOutside: () => void;

  className?: string;
};

const PORTAL_SELECTOR = '#popup_root';

export function Modal(props: ModalProps) {
  const overlayRef = useRef(null);
  const portalRef = useRef<Element | null>(null);

  useEffect(() => {
    portalRef.current = document.querySelector(PORTAL_SELECTOR);
  }, []);

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) {
      props.handleClickOutside();
    }
  };

  return props.isOpened && portalRef.current
    ? createPortal(
        <div
          className={clsx({
            ...(props.className ? { [props.className]: true } : null),
            [styles.overlay]: true,
            [styles.fullScreen]: props.fullScreen,
          })}
          ref={overlayRef}
          onClick={handleClick}
        >
          <div className={styles.container}>{props.children}</div>
        </div>,
        portalRef.current
      )
    : null;
}
