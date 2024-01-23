'use client';

import { useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { setUser } from '@/redux/stores/user';
import { useAppDispatch } from '@/redux/hooks';

import { IconButton } from '@/components/icon-button/icon-button';

import { User } from '@/api/types/user.types';
import { CookieHandler } from '@/cookie/cookie.handler';
import { ROUTES, RoutesHandler } from '@/routes/routes.handler';
import { useTruthSource } from '@/hooks/truth-source.hook';

import { ICONS } from '@/icons';
import styles from './user-bar.module.scss';

type UserBarProps = {
  user: User | null;
};

export function UserBar(props: UserBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  const [isOpened, setIsOpened] = useState(false);

  const toggleTooltip = () => {
    setIsOpened(!isOpened);
  };

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

  const logoutButton = useMemo(() => {
    return (
      <IconButton
        className={styles.logoutButton}
        onClick={handleLogoutClick}
        label='Logout'
        icon={ICONS.BUTTON.logoutIcon}
      />
    );
  }, []);

  return (
    <div className={styles.userBarWrapper}>
      {user ? (
        <>
          <div className={styles.userLabel} onClick={toggleTooltip}>
            {user.name}
          </div>
          {logoutButton}
          {isOpened ? <div className={styles.userTooltipWrapper}>{logoutButton}</div> : null}
        </>
      ) : (
        <IconButton onClick={handleLoginClick} label='Login' icon={ICONS.BUTTON.loginIcon} />
      )}
    </div>
  );
}
