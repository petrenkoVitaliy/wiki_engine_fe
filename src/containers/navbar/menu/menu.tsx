'use client';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/button/button';

import { ROUTES } from '@/routes/routes.handler';

import styles from './menu.module.scss';

export function Menu() {
  const router = useRouter();

  const handleRedirectToMainPage = () => {
    router.push(ROUTES.main());
  };

  const handleCreateNewArticle = () => {
    router.push(ROUTES.createArticle());
  };

  return (
    <div className={styles.menuWrapper}>
      <div className={styles.logo} onClick={handleRedirectToMainPage}>
        Wikifella
      </div>

      <Button onClick={handleCreateNewArticle} label='create' />
    </div>
  );
}
