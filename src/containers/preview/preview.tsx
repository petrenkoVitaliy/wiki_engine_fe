import { Article } from '@/api/types/article.types';
import { ArticleContent } from './article-content/article-content';

import styles from './preview.module.scss';

type PreviewProps = {
  article: Article;
  language: string;
};

export function Preview(props: PreviewProps) {
  return (
    <section className={styles.articleWrapper}>
      <ArticleContent {...props} />
    </section>
  );
}
