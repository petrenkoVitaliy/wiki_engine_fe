import { Menu } from './components/menu/menu';
import { SearchBar } from './components/search-bar/search-bar';
import { UserBar } from './components/user-bar/user-bar';

import styles from './navbar.module.scss';

export function Navbar() {
  return (
    <section className={styles.navbarWrapper}>
      <Menu />
      <SearchBar />
      <UserBar />
    </section>
  );
}
