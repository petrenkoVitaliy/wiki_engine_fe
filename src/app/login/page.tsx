import { LoginForm } from './login-form/login-form';

import styles from './page.module.scss';

export default async function Login() {
  return (
    <section className={styles.main}>
      <LoginForm />
    </section>
  );
}
