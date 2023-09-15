'use client';

import { useContext, useMemo } from 'react';
import { useParams } from 'next/navigation';

import { ApiMapper } from '@/mappers/api.mapper';

import { WysiwygEditor } from '@/containers/wysiwyg/wysiwyg-editor';
import { EditorHandler } from '@/containers/wysiwyg/handlers/editor-handler/editor.handler';

import { ArticleContext, ArticleEditMode } from '@/context/article-context';
import { useAppSelector } from '@/redux/hooks';
import { useTruthSource } from '@/hooks/truth-source.hook';

import { EditArticleBar } from './article-bar/edit-article-bar/edit-article-bar';
import { CreateArticleBar } from './article-bar/create-article-bar/create-article-bar';

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

  const routeParams = useParams();
  const language = useMemo(() => (routeParams.language || null) as string | null, [routeParams]);

  const editorHandler = useMemo(() => new EditorHandler(), []);
  const languages = useMemo(() => {
    if (!article) {
      return articleContext.languages || [];
    }

    return ApiMapper.getAvailableLanguages(article, articleContext.languages);
  }, [articleContext.languages, article]);

  const isEditorEditModeStore = useAppSelector((state) => state.editorReducer.isEditorEditMode);
  const isArticleCreationMode = useMemo(
    () =>
      articleContext.mode === ArticleEditMode.Creation ||
      articleContext.mode === ArticleEditMode.LanguageCreation,
    [articleContext.mode]
  );

  return (
    <section className={styles.articleContent}>
      {article && language ? (
        <EditArticleBar
          isEditMode={isArticleCreationMode || isEditorEditModeStore}
          article={article}
          editorHandler={editorHandler}
          language={language}
        />
      ) : (
        <CreateArticleBar article={article} editorHandler={editorHandler} languages={languages} />
      )}

      <section className={styles.articleBody}>
        <WysiwygEditor
          isEditMode={isArticleCreationMode || isEditorEditModeStore}
          article={!isArticleCreationMode ? article : null}
          language={language}
          editorHandler={editorHandler}
        />
      </section>
    </section>
  );
}
