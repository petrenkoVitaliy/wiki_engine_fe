import { Wysiwyg } from '@/containers/wysiwyg/wysiwyg';
import { ArticleBar } from './article-bar/article-bar';

import styles from './article-content.module.scss';
import { useMemo } from 'react';
import { EditorHandler } from '@/containers/wysiwyg/handlers/editor-handler/editor.handler';

export function ArticleContent() {
  const editorHandler = useMemo(() => new EditorHandler(), []);

  return (
    <section className={styles.articleContent}>
      <ArticleBar editorHandler={editorHandler} />
      <section className={styles.articleBody}>
        <Wysiwyg editorHandler={editorHandler} />
      </section>
    </section>
  );
}
