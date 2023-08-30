import { useState } from 'react';
import styles from './expand-menu.module.scss';

type MenuProps = {
  options: { label: string; value: string }[];
  onSelect: (value: string) => void;
};

export function ExpandMenu({ options, onSelect }: MenuProps) {
  const [isOpened, setOpened] = useState(false);

  return (
    <div className={styles.expandMenuWrapper} onClick={() => setOpened(!isOpened)}>
      <p>Menu</p>
      <ul className={`${styles.listContainer} ${isOpened ? styles.open : ''}`}>
        {options.map(({ value, label }) => (
          <li key={value} onClick={() => onSelect(value)}>
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
}
