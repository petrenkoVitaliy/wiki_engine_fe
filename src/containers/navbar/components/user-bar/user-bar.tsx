'use client';

import { usePathname, useRouter } from 'next/navigation';

import { Button } from '@/components/button/button';
import { User } from '@/api/types/user.types';

import { CookieHandler } from '@/cookie/cookie.handler';
import { ROUTES, RoutesHandler } from '@/routes/routes.handler';
import { useTruthSource } from '@/hooks/truth-source.hook';

import { setUser } from '@/redux/stores/user';
import { useAppDispatch } from '@/redux/hooks';

import styles from './user-bar.module.scss';

type UserBarProps = {
  user: User | null;
};

export function UserBar(props: UserBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  const user = useTruthSource({
    propSource: props.user,
    storeSelector: (state) => state.userReducer.user,
  });

  const handleLoginClick = () => {
    router.push(RoutesHandler.withQuery(ROUTES.login(), { from: pathname }));
  };

  const handleLogoutClick = () => {
    CookieHandler.removeAuthCookie();
    dispatch(setUser(null));

    router.refresh();
  };

  return (
    <div className={styles.userBarWrapper}>
      {user ? (
        <>
          <p>{user.name}</p>
          <Button label='logout' onClick={handleLogoutClick} />
        </>
      ) : (
        <Button label='login' onClick={handleLoginClick} />
      )}
    </div>
  );
}
