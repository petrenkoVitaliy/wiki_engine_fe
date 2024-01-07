'use client';

import { useState } from 'react';
import clsx from 'clsx';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

import { useAppSelector } from '@/redux/hooks';

import { scrollToBeginning, scrollToElementWithId, stringToHashId } from '@/utils/utils';
import { ICONS } from '@/icons';

import styles from './table-content.module.scss';

type TableContentProps = {
  isCreation?: boolean;
};
export function TableContent({ isCreation }: TableContentProps) {
  const headings = useAppSelector((state) => state.editorReducer.headings);

  const pathname = usePathname();

  const [isOpened, setIsOpened] = useState(false);

  const handleItemClick = (heading?: string) => {
    if (!heading) {
      scrollToBeginning();
      window.history.pushState({}, '', pathname);

      return;
    }

    const id = stringToHashId(heading);

    const isScrolled = scrollToElementWithId(id);

    if (isScrolled) {
      window.history.pushState({}, '', `${pathname}#${heading}`);
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
        <Image src={ICONS.scrollIcon} alt='content' width={28} />
      </div>
      <div className={styles.tableContent}>
        <ol className={styles.tableList}>
          {headings.length ? (
            <>
              <li key='beginning' onClick={() => handleItemClick()}>
                ~ Beginning ~
              </li>
              {headings.map((heading, index) => (
                <li key={index} onClick={() => handleItemClick(heading)}>
                  {heading}
                </li>
              ))}
            </>
          ) : (
            <span>Nothing here yet...</span>
          )}
        </ol>
      </div>
    </section>
  );
}
