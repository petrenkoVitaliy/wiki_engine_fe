'use client';

import { useState } from 'react';
import clsx from 'clsx';
import Image from 'next/image';

import { useAppSelector } from '@/redux/hooks';
import { stringToHash } from '@/utils/utils';

import { ICONS } from './icons';

import styles from './table-content.module.scss';

const SCROLL_OFFSET = -80;

type TableContentProps = {
  isCreation?: boolean;
};
export function TableContent({ isCreation }: TableContentProps) {
  const headings = useAppSelector((state) => state.editorReducer.headings);

  const [isOpened, setIsOpened] = useState(false);

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
    <section
      className={clsx({
        [styles.tableContentWrapper]: true,
        [styles.creation]: isCreation,
        [styles.open]: isOpened,
      })}
    >
      <div className={styles.tableContentHeader} onClick={handleContainerClick}>
        <Image src={ICONS.contentIcon} alt='content' width={30} height={28} />
        <div>content</div>
      </div>
      <div className={styles.tableContent}>
        <ol className={styles.tableList}>
          {headings.map((heading, index) => (
            <li key={index} onClick={() => handleItemClick(heading)}>
              {heading}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
