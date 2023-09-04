'use client';
import { Button } from '@/components/button/button';
import styles from './menu.module.scss';

export function Menu() {
  const handleCreateNewArticle = () => {};

  return (
    <div className={styles.menuWrapper}>
      <p>Wiki engine</p>

      <Button onClick={handleCreateNewArticle} label='create new' />
    </div>
  );
}
