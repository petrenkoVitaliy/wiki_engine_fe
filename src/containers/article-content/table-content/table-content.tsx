import { useAppSelector } from '@/redux/hooks';

import { stringToHash } from '@/utils/utils';

import styles from './table-content.module.scss';

const SCROLL_OFFSET = -80;

export function TableContent() {
  const headings = useAppSelector((state) => state.editorReducer.headings);

  const handleClick = (heading: string) => {
    const id = stringToHash(heading);
    const element = document.getElementById(id);

    if (element) {
      window.scrollTo({
        behavior: 'smooth',
        top: element.getBoundingClientRect().top + window.scrollY + SCROLL_OFFSET,
      });
    }
  };

  return (
    <section className={styles.tableContent}>
      <h3>Content</h3>
      <ul className={styles.tableList}>
        {headings.map((heading, index) => (
          <li key={index} onClick={() => handleClick(heading)}>
            {heading}
          </li>
        ))}
      </ul>
    </section>
  );
}
