'use client';
import { Button } from '@/components/button/button';
import styles from './menu.module.scss';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/routes/routes.handler';

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
