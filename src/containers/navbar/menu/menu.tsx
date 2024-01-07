'use client';
import { useRouter } from 'next/navigation';

import { SearchModal } from '@/components/search-modal/search-modal';
import { IconButton } from '@/components/icon-button/icon-button';

import { ROUTES } from '@/routes/routes.handler';
import { ICONS } from '@/icons';

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
        Wikїfella
      </div>

      <div className={styles.controlsWrapper}>
        <IconButton
          onClick={handleCreateNewArticle}
          label='Create'
          icon={ICONS.BUTTON.createIcon}
          collapsable
        />

        <SearchModal label='Search' placeholder='Search article' />
      </div>
    </div>
  );
}
