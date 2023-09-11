'use client';

import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { useAppDispatch } from '@/redux/hooks';
import { toggleEditMode, editArticle, updateArticleType } from '@/redux/stores/editor';

import { Select } from '@/components/select/select';
import { Button } from '@/components/button/button';
import { ConfirmationModal } from '@/components/confirmation-modal/confirmation-modal';
import { Input } from '@/components/input/input';

import { useRouter } from 'next/navigation';
import { ROUTES } from '@/routes/routes.handler';

import { ApiMapper } from '@/mappers/api.mapper';
import { Article, ArticleType, articleTypesOptions } from '@/api/types/article.types';

import { useModalControls } from '@/hooks/modal-controls.hook';

import { EditorHandler } from '@/containers/wysiwyg/handlers/editor-handler/editor.handler';
import { CustomElement } from '@/containers/wysiwyg/types';

import 'react-toastify/dist/ReactToastify.css';
import styles from './article-bar.module.scss';

type FormValues = { language: string; name: string; articleType: ArticleType };

type ArticleBarProps = {
  article: Article;
  isEditMode: boolean;
  language: string;
  editorHandler: EditorHandler;
};

export function EditArticleBar(props: ArticleBarProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { isOpened, handleCloseModal, handleOpenModal } = useModalControls();

  const articleOptions = useMemo(() => {
    const { article, language } = props;

    const languageOptions = ApiMapper.getLanguageOptionsFromArticle(article);

    return {
      languageOptions,
      articleName: article.languagesMap[language].name,
    };
  }, [props.article, props.language]);

  const { register, handleSubmit, getValues } = useForm<FormValues>({
    values: {
      language: props.language,
      name: articleOptions.articleName,
      articleType: props.article.article_type,
    },
  });

  const onLanguageChange = (data: FormValues) => {
    router.push(
      ROUTES.articleLanguage(props.article.languagesMap[data.language].name_key, data.language)
    );
  };

  const onArticleTypeChange = (data: FormValues) => {
    dispatch(
      updateArticleType({
        articleType: data.articleType,
        storedArticle: props.article,
        callback: handleResponse,
      })
    );
  };

  const onSubmit = () => {
    handleOpenModal();
  };

  const handleHistoryClick = () => {
    const { article, language } = props;

    router.push(ROUTES.articleLanguageHistory(article.languagesMap[language].name_key, language));
  };

  const handleEditMode = () => {
    dispatch(toggleEditMode());
  };

  const handleAddLanguage = () => {
    const { language, article } = props;

    router.push(ROUTES.createLanguage(article.languagesMap[language].name_key));
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

    const { article, language } = props;
    const { name } = getValues();

    const elements = props.editorHandler.editor.children as CustomElement[];

    dispatch(
      editArticle({
        elements,
        id: article.id,
        language: language,
        callback: handleResponse,
        storedArticle: article,
        name: name !== articleOptions.articleName ? name : undefined,
      })
    );
  };

  return (
    <section className={styles.articleBar}>
      <div className={styles.headingWrapper}>
        <Input formRegister={register('name')} disabled={!props.isEditMode} highlighted />
      </div>

      <div className={styles.controlPanel}>
        <div className={styles.selectsPanel}>
          <Select
            formRegister={register('language')}
            onChange={handleSubmit(onLanguageChange)}
            options={articleOptions.languageOptions}
          />

          <Select
            formRegister={register('articleType')}
            onChange={handleSubmit(onArticleTypeChange)}
            options={articleTypesOptions}
          />
        </div>

        <div className={styles.buttonsPanel}>
          {props.isEditMode ? (
            <>
              <Button onClick={onSubmit} label='Save' />
              <Button onClick={handleEditMode} label='Cancel' />
            </>
          ) : (
            <>
              <Button onClick={handleHistoryClick} label='History' />
              <Button onClick={handleAddLanguage} label='Add language' />
              <Button onClick={handleEditMode} label='Edit' />
            </>
          )}
        </div>
      </div>

      <ConfirmationModal
        isOpened={isOpened}
        label='Are you sure you want to edit article?'
        cancelLabel='No'
        submitLabel='Yes'
        handleSubmit={handleSaveArticle}
        handleClose={handleCloseModal}
      />
    </section>
  );
}
