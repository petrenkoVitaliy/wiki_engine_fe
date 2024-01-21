import { ResetForm } from './reset-form/reset-form';

import styles from './page.module.scss';

export default async function Reset() {
  return (
    <section className={styles.main}>
      <ResetForm />
    </section>
  );
}
