import { ConfirmForm } from './confirm-form/confirm-form';

import styles from '../page.module.scss';

export default async function ResetConfirm() {
  return (
    <section className={styles.main}>
      <ConfirmForm />
    </section>
  );
}
