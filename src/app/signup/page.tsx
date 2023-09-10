import { SignupForm } from './signup-form/signup-form';

import styles from './page.module.scss';

export default async function Signup() {
  return (
    <section className={styles.main}>
      <SignupForm />
    </section>
  );
}
