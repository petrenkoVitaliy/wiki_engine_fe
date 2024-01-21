import { ResetForm } from './reset-form/reset-form';

import styles from './page.module.scss';

export default async function Login() {
  return (
    <section className={styles.main}>
      <ResetForm />
    </section>
  );
}
