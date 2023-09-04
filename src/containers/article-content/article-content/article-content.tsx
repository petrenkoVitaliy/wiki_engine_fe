import { Wysiwyg } from '@/containers/wysiwyg/wysiwyg';
import { EditArticleBar } from './article-bar/edit-article-bar';
import { CreateArticleBar } from './article-bar/create-article-bar';

import { useContext, useMemo } from 'react';
import { EditorHandler } from '@/containers/wysiwyg/handlers/editor-handler/editor.handler';
import { createArticle, editArticle } from '@/redux/slices/editor.slice';

import styles from './article-content.module.scss';
import { ArticleContext } from '@/context/article-context';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { Article } from '@/api/types/article.types';
import { toast } from 'react-toastify';
import { useTruthSource } from '@/hooks/truth-source.hook';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/routes/routes.handler';

export function ArticleContent() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const articleContext = useContext(ArticleContext);
  const article = useTruthSource({
    propSource: articleContext?.article || null,
    storeSelector: (store) => store.editorReducer.article,
  });

  const isEditModeStore = useAppSelector((state) => state.editorReducer.isEditMode);

  const isEditMode = useMemo(() => !article || isEditModeStore, [isEditModeStore, article]);
  const editorHandler = useMemo(() => new EditorHandler(), []);
  const languages = useMemo(() => articleContext?.languages || [], [articleContext]);

  const handleSaveArticle = (article: Article | null) => {
    if (article) {
      toast('Article was successfully updated', { type: 'success' });
    } else {
      toast('Failed to save article', { type: 'error' });
    }
  };

  const handleSubmitEdit = () => {
    const content = JSON.stringify(editorHandler.editor.children);

    if (article) {
      // TODO
      dispatch(
        editArticle({
          content: content,
          id: article.id,
          language: article.language.language.code,
          callback: handleSaveArticle,
          storedArticle: article,
        })
      );
    }
  };

  const handleCreateArticle = (article: Article | null) => {
    if (article) {
      toast('Article was successfully updated', { type: 'success' });

      router.push(ROUTES.articleLanguage(article.language.language.code, article.id));
    } else {
      toast('Failed to save article', { type: 'error' });
    }
  };

  const handleSubmitCreate = (values: { name: string; language: string }) => {
    const content = JSON.stringify(editorHandler.editor.children);

    dispatch(
      createArticle({
        content: content,
        language: values.language,
        name: values.name,
        callback: handleCreateArticle,
      })
    );
  };

  return (
    <section className={styles.articleContent}>
      {article ? (
        <EditArticleBar isEditMode={isEditMode} article={article} handleSubmit={handleSubmitEdit} />
      ) : (
        <CreateArticleBar handleSubmit={handleSubmitCreate} languages={languages} />
      )}

      <section className={styles.articleBody}>
        <Wysiwyg isEditMode={isEditMode} article={article} editorHandler={editorHandler} />
      </section>
    </section>
  );
}
