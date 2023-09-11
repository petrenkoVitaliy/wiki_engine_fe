'use client';

import { ArticleContent } from './article-content/article-content';
import { TableContent } from './table-content/table-content';

import styles from './article.module.scss';

type ArticleSectionProps = {
  isCreation?: boolean;
};

export function ArticleSection({ isCreation }: ArticleSectionProps) {
  return (
    <section className={styles.articleWrapper}>
      <TableContent isCreation={isCreation} />
      <ArticleContent />
    </section>
  );
}
