import { ArticleContent } from './article-content/article-content';

import styles from './article-history.module.scss';

export function ArticleHistory() {
  return (
    <section className={styles.articleWrapper}>
      <ArticleContent />
    </section>
  );
}
