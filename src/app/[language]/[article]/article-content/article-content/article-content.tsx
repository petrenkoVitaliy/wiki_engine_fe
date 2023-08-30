import { ArticleBar } from './article-bar/article-bar';
import { ArticleBody } from './article-body/article-body';

import styles from './article-content.module.scss';

export function ArticleContent() {
  return (
    <section className={styles.articleContent}>
      <ArticleBar />
      <ArticleBody />
    </section>
  );
}
