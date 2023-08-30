import { Wysiwyg } from '@/containers/wysiwyg/wysiwyg';

import styles from './article-body.module.scss';

export function ArticleBody() {
  return (
    <section className={styles.articleBody}>
      <Wysiwyg />
    </section>
  );
}
