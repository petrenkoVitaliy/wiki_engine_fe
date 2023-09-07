'use client';

import { ArticleContent } from './article-content/article-content';

import styles from './article.module.scss';

export function ArticleHistory() {
  return (
    <section className={styles.articleWrapper}>
      <ArticleContent />
    </section>
  );
}
