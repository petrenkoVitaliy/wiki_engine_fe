import { useForm } from 'react-hook-form';

import { Modal } from '../modal/modal';
import { Button } from '../button/button';
import { Input } from '../input/input';

import styles from './prompt-modal.module.scss';

type PromptModalProps<T> = {
  promptParams: (T & { placeholder: string }) | null;
  handleClose: () => void;
  handleSubmit: (params: T, response: string | null) => void;

  label: string;
  cancelLabel: string;
  submitLabel: string;
};

type FormValues = {
  response: string;
};

export function PromptModal<T>(props: PromptModalProps<T>) {
  const { register, handleSubmit, setValue } = useForm<FormValues>();

  const onSubmit = (data: FormValues) => {
    if (props.promptParams) {
      props.handleSubmit(props.promptParams, data.response || null);

      setValue('response', '');
    }
  };

  return (
    <Modal handleClickOutside={props.handleClose} isOpened={!!props.promptParams}>
      <div className={styles.modalContent}>
        <div className={styles.heading}>{props.label}</div>

        <div className={styles.promptWrapper}>
          <Input
            formRegister={register('response')}
            highlighted
            placeholder={props.promptParams?.placeholder}
            name={props.label}
          />
        </div>

        <div className={styles.controls}>
          <Button label={props.submitLabel} onClick={handleSubmit(onSubmit)} />
          <Button label={props.cancelLabel} onClick={props.handleClose} />
        </div>
      </div>
    </Modal>
  );
}
