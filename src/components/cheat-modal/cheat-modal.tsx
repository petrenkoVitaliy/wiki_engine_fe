import Image from 'next/image';
import { useCallback, useState } from 'react';

import { ICONS } from '@/icons';

import { Modal } from '../modal/modal';

import styles from './cheat-modal.module.scss';

export function CheatModal() {
  const [isOpened, setIsOpened] = useState(false);

  const handleClose = useCallback(() => {
    setIsOpened(false);
  }, []);

  const handleOpen = useCallback(() => {
    setIsOpened(true);
  }, []);

  return (
    <>
      <div className={styles.filler} />
      <button className={styles.cheatButton} onMouseDown={handleOpen}>
        <Image src={ICONS.BUTTON.questionIcon} alt='Cheatsheet' />
      </button>

      <Modal handleClickOutside={handleClose} isOpened={isOpened} className={styles.container}>
        <div className={styles.modalContent}>
          <div className={styles.title}>Cheatsheet</div>

          <p>Use various format functions to customize text:</p>

          <div className={styles.sectionWrapper}>
            <Image src={ICONS.WYSIWYG.boldIcon} alt='bold text' />
            <p> -&nbsp; bold text</p>
          </div>

          <div className={styles.sectionWrapper}>
            <Image src={ICONS.WYSIWYG.italicIcon} alt='italic text' />
            <p> -&nbsp; italic text</p>
          </div>

          <div className={styles.sectionWrapper}>
            <Image src={ICONS.WYSIWYG.underlineIcon} alt='underlined text' />
            <p> -&nbsp; underlined text</p>
          </div>

          <div className={styles.sectionWrapper}>
            <Image src={ICONS.WYSIWYG.codeIcon} alt='code block' />
            <p> -&nbsp; code block</p>
          </div>

          <div className={styles.sectionWrapper}>
            <Image src={ICONS.WYSIWYG.quoteIcon} alt='quote block' />
            <p> -&nbsp; quote block</p>
          </div>

          <div className={styles.sectionWrapper}>
            <Image src={ICONS.WYSIWYG.headingH1Icon} alt='heading level 1' />
            <Image src={ICONS.WYSIWYG.headingH2Icon} alt='heading level 2' />
            <p> -&nbsp; header and subheader </p>
          </div>

          <div className={styles.sectionWrapper}>
            <div className={styles.invertedBackground}>
              <Image src={ICONS.scrollIcon} alt='content menu' width={24} height={24} />
            </div>
            <p>
              headings appear in the content menu, <br /> you can use them to navigate through the
              article
            </p>
          </div>

          <div className={styles.sectionWrapper}>
            <Image src={ICONS.WYSIWYG.bulletListIcon} alt='bullet list' />
            <Image src={ICONS.WYSIWYG.numberListIcon} alt='number list' />
            <p> -&nbsp; bulleted and numbered lists</p>
          </div>

          <div className={styles.sectionWrapper}>
            <Image src={ICONS.WYSIWYG.alignLeftIcon} alt='left align' />
            <Image src={ICONS.WYSIWYG.alignRightIcon} alt='right align' />
            <Image src={ICONS.WYSIWYG.alignCenterIcon} alt='center align' />
            <Image src={ICONS.WYSIWYG.alignJustifyIcon} alt='justify align' />
            <p> -&nbsp; texts align modes</p>
          </div>

          <div className={styles.sectionWrapper}>
            <Image src={ICONS.WYSIWYG.twitterIcon} alt='tweet' />
            <p>
              add tweet preview - just insert link to specific tweet into editor
              <br /> like:&nbsp; <code>https://twitter.com/user/status/id</code> <br />
              and it will be uploaded automatically
            </p>
          </div>

          <div className={styles.sectionWrapper}>
            <Image src={ICONS.WYSIWYG.youtubeIcon} alt='youtube' />
            <p>
              or youtube embedded video, copy link from youtube page and insert it into
              editor:&nbsp;
              <code>https://www.youtube.com/watch?v=id</code> <br />
            </p>
          </div>

          <div className={styles.sectionWrapper}>
            <Image src={ICONS.WYSIWYG.linkIcon} alt='link' />
            <p>
              or just a simple link to another resource. <br />
            </p>
          </div>

          <div className={styles.sectionWrapper}>
            <p>
              All link-functions work automatically or you can also use dedicated function button
              from toolbar. <br />
              <b>Note:</b> widgets work differently in Edit/View modes (like interactions with
              images)
            </p>
          </div>

          <div className={styles.sectionWrapper}>
            <p>Feel free to combine different styles at the same time</p>
          </div>
        </div>
      </Modal>
    </>
  );
}
