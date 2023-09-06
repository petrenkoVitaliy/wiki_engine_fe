import { User } from '@/api/types/user.types';

import { Menu } from './components/menu/menu';
import { UserBar } from './components/user-bar/user-bar';

import styles from './navbar.module.scss';

type NavbarProps = {
  user: User | null;
};

export function Navbar(props: NavbarProps) {
  return (
    <section className={styles.navbarWrapper}>
      <Menu />

      <UserBar user={props.user} />
    </section>
  );
}
