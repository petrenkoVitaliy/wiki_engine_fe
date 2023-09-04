'use client';

import { useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { Button } from '@/components/button/button';
import { User } from '@/api/types/user.types';
import { useAppSelector } from '@/redux/hooks';

import styles from './user-bar.module.scss';
import { CookieHandler } from '@/cookie/cookie.handler';
import { ROUTES, RoutesHandler } from '@/routes/routes.handler';

type UserBarProps = {
  user: User | null;
};

export function UserBar(props: UserBarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const storedUser = useAppSelector((state) => state.userReducer.user);

  const user = useMemo(() => props.user || storedUser, [props, storedUser]);

  const onLoginClick = () => {
    router.push(RoutesHandler.withQuery(ROUTES.login(), { from: pathname }));
  };

  const onLogoutClick = () => {
    CookieHandler.removeAuthCookie();
    router.refresh();
  };

  return (
    <div className={styles.userBarWrapper}>
      {user ? (
        <>
          <p>{user.name}</p>
          <Button label='logout' onClick={onLogoutClick} />
        </>
      ) : (
        <Button label='login' onClick={onLoginClick} />
      )}
    </div>
  );
}
