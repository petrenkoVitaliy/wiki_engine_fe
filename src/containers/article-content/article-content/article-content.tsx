import { useContext, useMemo } from 'react';

import { Wysiwyg } from '@/containers/wysiwyg/wysiwyg';
import { EditorHandler } from '@/containers/wysiwyg/handlers/editor-handler/editor.handler';

import { ArticleContext } from '@/context/article-context';
import { useAppSelector } from '@/redux/hooks';
import { useTruthSource } from '@/hooks/truth-source.hook';

import { EditArticleBar } from './article-bar/edit-article-bar';
import { CreateArticleBar } from './article-bar/create-article-bar';

import styles from './article-content.module.scss';

export function ArticleContent() {
  const articleContext = useContext(ArticleContext);
  const article = useTruthSource({
    propSource: articleContext?.article || null,
    storeSelector: (store) => store.editorReducer.article,
  });

  const isEditModeStore = useAppSelector((state) => state.editorReducer.isEditMode);

  const isEditMode = useMemo(() => !article || isEditModeStore, [isEditModeStore, article]);
  const editorHandler = useMemo(() => new EditorHandler(), []);
  const languages = useMemo(() => articleContext?.languages || [], [articleContext]);

  return (
    <section className={styles.articleContent}>
      {article ? (
        <EditArticleBar isEditMode={isEditMode} article={article} editorHandler={editorHandler} />
      ) : (
        <CreateArticleBar editorHandler={editorHandler} languages={languages} />
      )}

      <section className={styles.articleBody}>
        <Wysiwyg isEditMode={isEditMode} article={article} editorHandler={editorHandler} />
      </section>
    </section>
  );
}
