'use client';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/button/button';
import { ROUTES } from '@/routes/routes.handler';

import styles from './menu.module.scss';

export function Menu() {
  const router = useRouter();

  const handleCreateNewArticle = () => {
    router.push(ROUTES.create());
  };

  return (
    <div className={styles.menuWrapper}>
      <p>Wiki engine</p>

      <Button onClick={handleCreateNewArticle} label='create new' />
    </div>
  );
}
