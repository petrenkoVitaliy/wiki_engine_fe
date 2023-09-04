'use client';

import { useContext, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { toggleEditMode, saveArticle } from '@/redux/slices/editor.slice';

import { HeadingContainer } from '@/components/heading-container/heading-container';
import { Select } from '@/components/select/select';
import { Button } from '@/components/button/button';

import styles from './article-bar.module.scss';
import { useRouter } from 'next/navigation';
import { ArticleContext } from '../../../../../../context/article-context';
import { ROUTES } from '@/routes/routes.handler';
import { EditorHandler } from '@/containers/wysiwyg/handlers/editor-handler/editor.handler';
import { Article } from '@/api/types/article.types';

import 'react-toastify/dist/ReactToastify.css';
import { ConfirmationModal } from '@/components/confirmation-modal/confirmation-modal';
import { useModalControls } from '@/hooks/modal-controls.hook';

type FormValues = { language: string };

type ArticleBarProps = {
  editorHandler: EditorHandler;
};

export function ArticleBar(props: ArticleBarProps) {
  const articleContext = useContext(ArticleContext); // TODO hook
  if (!articleContext) return null;

  const { isOpened, handleCloseModal, handleOpenModal } = useModalControls();

  const router = useRouter();
  const dispatch = useAppDispatch();

  const isEditMode = useAppSelector((state) => state.editorReducer.isEditMode);

  const { register, handleSubmit } = useForm<FormValues>({
    values: { language: articleContext.article.language.language.code },
  });

  const articleOptions = useMemo(() => {
    const { article } = articleContext;

    const languageOptions =
      article.otherLanguages.map((languageCode) => ({
        value: languageCode,
        label: languageCode,
      })) || [];

    const selectedLanguage = article.language.language.code;

    languageOptions.push({
      label: selectedLanguage,
      value: selectedLanguage,
    });

    return {
      articleId: article.id,
      articleName: article.language.name,
      selectedLanguage: selectedLanguage,
      languageOptions,
    };
  }, [articleContext]);

  const onLanguageChange = (data: FormValues) => {
    if (articleOptions.articleId) {
      router.push(ROUTES.articleLanguage(data.language, articleOptions.articleId));
    }
  };

  const handleSaveArticle = (article: Article | null) => {
    if (article) {
      toast('Article was successfully updated', { type: 'success' });
    } else {
      toast('Failed to save article', { type: 'error' });
    }
  };

  const onSubmit = () => {
    // TODO auth check
    handleOpenModal();
  };

  const handleEditMode = () => {
    dispatch(toggleEditMode());
  };

  const handleSubmitConfirmPopup = () => {
    handleCloseModal();

    const content = JSON.stringify(props.editorHandler.editor.children);

    dispatch(
      saveArticle({
        content: content,
        id: articleContext.article.id,
        language: articleContext.article.language.language.code,
        callback: handleSaveArticle,
        storedArticle: articleContext.article,
      })
    );
  };

  return (
    <section className={styles.articleBar}>
      <HeadingContainer articleName={articleOptions.articleName} />
      <div className={styles.controlPanel}>
        <Select
          formRegister={register('language')}
          onChange={handleSubmit(onLanguageChange)}
          options={articleOptions.languageOptions}
        />

        {isEditMode ? (
          <>
            <Button onClick={onSubmit} label='Save' />
            <Button onClick={handleEditMode} label='Cancel' />
          </>
        ) : (
          <Button onClick={handleEditMode} label='Edit' />
        )}
      </div>

      <ConfirmationModal
        isOpen={isOpened}
        label='Are you sure you want to edit article?'
        cancelLabel='No'
        submitLabel='Yes'
        handleSubmit={handleSubmitConfirmPopup}
        handleClose={handleCloseModal}
      />
    </section>
  );
}
