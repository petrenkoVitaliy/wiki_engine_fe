import { useContext, useMemo } from 'react';

import { Wysiwyg } from '@/containers/wysiwyg/wysiwyg';
import { EditorHandler } from '@/containers/wysiwyg/handlers/editor-handler/editor.handler';

import { ArticleContext, ArticleEditMode } from '@/context/article-context';
import { useAppSelector } from '@/redux/hooks';
import { useTruthSource } from '@/hooks/truth-source.hook';

import { EditArticleBar } from './article-bar/edit-article-bar';
import { CreateArticleBar } from './article-bar/create-article-bar';

import styles from './article-content.module.scss';

export function ArticleContent() {
  const articleContext = useContext(ArticleContext);

  if (!articleContext) {
    return null;
  }

  const article = useTruthSource({
    propSource: articleContext?.article || null,
    storeSelector: (store) => store.editorReducer.article,
  });

  const isCreationMode = useMemo(
    () => articleContext.mode !== ArticleEditMode.Edit,
    [articleContext.mode]
  );

  const isEditModeStore = useAppSelector((state) => state.editorReducer.isEditMode);
  const isEditMode = useMemo(
    () =>
      articleContext.mode === ArticleEditMode.Creation ||
      articleContext.mode === ArticleEditMode.LanguageCreation ||
      isEditModeStore,
    [isEditModeStore, articleContext.mode]
  );

  const editorHandler = useMemo(() => new EditorHandler(), []);
  const languages = useMemo(() => articleContext?.languages || [], [articleContext]);

  return (
    <section className={styles.articleContent}>
      {article && !isCreationMode ? (
        <EditArticleBar isEditMode={isEditMode} article={article} editorHandler={editorHandler} />
      ) : (
        <CreateArticleBar article={article} editorHandler={editorHandler} languages={languages} />
      )}

      <section className={styles.articleBody}>
        <Wysiwyg
          isEditMode={isEditMode}
          article={!isCreationMode ? article : null}
          editorHandler={editorHandler}
        />
      </section>
    </section>
  );
}
