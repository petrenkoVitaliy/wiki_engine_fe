'use client';

import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { useAppDispatch } from '@/redux/hooks';
import { toggleEditMode, editArticle } from '@/redux/slices/editor.slice';

import { Select } from '@/components/select/select';
import { Button } from '@/components/button/button';
import { ConfirmationModal } from '@/components/confirmation-modal/confirmation-modal';

import { useRouter } from 'next/navigation';
import { ROUTES } from '@/routes/routes.handler';

import { ApiMapper } from '@/api/api.mapper';
import { Article } from '@/api/types/article.types';

import { useModalControls } from '@/hooks/modal-controls.hook';
import { EditorHandler } from '@/containers/wysiwyg/handlers/editor-handler/editor.handler';

import 'react-toastify/dist/ReactToastify.css';
import styles from './article-bar.module.scss';

type FormValues = { language: string };

type ArticleBarProps = {
  article: Article;
  isEditMode: boolean;
  editorHandler: EditorHandler;
};

export function EditArticleBar(props: ArticleBarProps) {
  const { isOpened, handleCloseModal, handleOpenModal } = useModalControls();

  const router = useRouter();
  const dispatch = useAppDispatch();

  const { register, handleSubmit } = useForm<FormValues>({
    values: { language: props.article.language.language.code },
  });

  const articleOptions = useMemo(() => {
    const { article } = props;

    const languageOptions = ApiMapper.getLanguageOptionsFromArticle(article);

    return {
      languageOptions,
      articleName: article.language.name,
    };
  }, [props.article]);

  const onLanguageChange = (data: FormValues) => {
    router.push(ROUTES.articleLanguage(data.language, props.article.id));
  };

  const onSubmit = () => {
    // TODO auth check
    handleOpenModal();
  };

  const handleEditMode = () => {
    dispatch(toggleEditMode());
  };

  const handleResponse = (article: Article | null) => {
    if (article) {
      toast('Article was successfully updated', { type: 'success' });
    } else {
      toast('Failed to save article', { type: 'error' });
    }
  };

  const handleSaveArticle = () => {
    handleCloseModal();

    const { article } = props;

    const content = JSON.stringify(props.editorHandler.editor.children);

    dispatch(
      editArticle({
        content: content,
        id: article.id,
        language: article.language.language.code,
        callback: handleResponse,
        storedArticle: article,
      })
    );
  };

  return (
    <section className={styles.articleBar}>
      <div className={styles.headingWrapper}>
        <p>{articleOptions.articleName}</p>
      </div>

      <div className={styles.controlPanel}>
        <Select
          formRegister={register('language')}
          onChange={handleSubmit(onLanguageChange)}
          options={articleOptions.languageOptions}
        />

        {props.isEditMode ? (
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
        handleSubmit={handleSaveArticle}
        handleClose={handleCloseModal}
      />
    </section>
  );
}
