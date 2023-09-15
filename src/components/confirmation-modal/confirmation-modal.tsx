import { Modal } from '../modal/modal';
import { Button } from '../button/button';

import styles from './confirmation-modal.module.scss';

type ConfirmationModalProps = {
  isOpened: boolean;
  handleClose: () => void;
  handleSubmit: () => void;

  label: string;
  cancelLabel: string;
  submitLabel: string;
};

export function ConfirmationModal(props: ConfirmationModalProps) {
  return props.isOpened ? (
    <Modal handleClickOutside={props.handleClose}>
      <div className={styles.modalContent}>
        <div className={styles.heading}>{props.label}</div>

        <div className={styles.controls}>
          <Button label={props.submitLabel} onClick={props.handleSubmit} />
          <Button label={props.cancelLabel} onClick={props.handleClose} />
        </div>
      </div>
    </Modal>
  ) : null;
}
