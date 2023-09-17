import { ArticleContent } from './article-content/article-content';

import styles from './preview.module.scss';

export function Preview() {
  return (
    <section className={styles.articleWrapper}>
      <ArticleContent />
    </section>
  );
}
