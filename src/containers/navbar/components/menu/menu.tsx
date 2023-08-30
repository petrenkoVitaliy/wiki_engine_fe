'use client';

import { ExpandMenu } from '@/components/expand-menu/expand-menu';
import styles from './menu.module.scss';

export function Menu() {
  const onItemSelect = (item: string) => {
    console.log(item);
  };

  return (
    <div className={styles.menuWrapper}>
      <ExpandMenu
        onSelect={onItemSelect}
        options={[
          { label: 'menu1', value: 'menu1' },
          { label: 'menu2', value: 'menu2' },
        ]}
      />
      <p>Wiki engine</p>
    </div>
  );
}
