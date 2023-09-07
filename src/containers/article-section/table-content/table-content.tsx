import { useAppSelector } from '@/redux/hooks';

import { stringToHash } from '@/utils/utils';

import styles from './table-content.module.scss';
import { useState } from 'react';

const SCROLL_OFFSET = -80;

export function TableContent() {
  const headings = useAppSelector((state) => state.editorReducer.headings);

  const [isOpened, setIsOpened] = useState(true);

  const handleItemClick = (heading: string) => {
    const id = stringToHash(heading);
    const element = document.getElementById(id);

    if (element) {
      window.scrollTo({
        behavior: 'smooth',
        top: element.getBoundingClientRect().top + window.scrollY + SCROLL_OFFSET,
      });
    }
  };

  const handleContainerClick = () => {
    setIsOpened(!isOpened);
  };

  return (
    <section className={`${styles.tableContent} ${isOpened ? styles.open : ''}`}>
      <h3 onClick={handleContainerClick}>Content</h3>
      <ul className={styles.tableList}>
        {headings.map((heading, index) => (
          <li key={index} onClick={() => handleItemClick(heading)}>
            {heading}
          </li>
        ))}
      </ul>
    </section>
  );
}
