'use client';

import { ArticleContent } from './article-content/article-content';
import { TableContent } from './table-content/table-content';

import styles from './article.module.scss';

export function Article() {
  return (
    <section className={styles.articleWrapper}>
      <TableContent />
      <ArticleContent />
    </section>
  );
}
