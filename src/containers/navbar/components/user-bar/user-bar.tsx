'use client';

import { Button } from '@/components/button/button';

import styles from './user-bar.module.scss';

export function UserBar() {
  const onLoginClick = () => {};

  return (
    <div className={styles.userBarWrapper}>
      <p>User Name</p>
      <Button label='login' onClick={onLoginClick} />
    </div>
  );
}
