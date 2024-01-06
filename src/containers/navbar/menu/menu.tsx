'use client';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/button/button';

import { ROUTES } from '@/routes/routes.handler';

import styles from './menu.module.scss';
import { SearchModal } from '@/components/search-modal/search-modal';

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
        Wikїfella
      </div>

      <div className={styles.controlsWrapper}>
        <Button onClick={handleCreateNewArticle} label='Create' />
        <SearchModal label='Search' placeholder='Search article' />
      </div>
    </div>
  );
}
