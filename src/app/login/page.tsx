'use client';

import { LoginForm } from './login-form/login-form';

import styles from './page.module.scss';

export default function Login() {
  return (
    <main className={styles.main}>
      <LoginForm />
    </main>
  );
}
