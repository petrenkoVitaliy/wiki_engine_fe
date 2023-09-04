'use client';

import { useMemo } from 'react';
import { useForm } from 'react-hook-form';

import { useAppDispatch } from '@/redux/hooks';
import { toggleEditMode } from '@/redux/slices/editor.slice';

import { Select } from '@/components/select/select';
import { Button } from '@/components/button/button';

import styles from './article-bar.module.scss';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/routes/routes.handler';
import { Article } from '@/api/types/article.types';

import 'react-toastify/dist/ReactToastify.css';
import { ConfirmationModal } from '@/components/confirmation-modal/confirmation-modal';
import { useModalControls } from '@/hooks/modal-controls.hook';
import { apiMapper } from '@/api/api.mapper';

type FormValues = { language: string };

type ArticleBarProps = {
  article: Article;
  isEditMode: boolean;
  handleSubmit: () => void;
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

    const languageOptions = apiMapper.getLanguageOptionsFromArticle(article);

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

  const handleSubmitConfirmPopup = () => {
    handleCloseModal();

    props.handleSubmit();
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
        handleSubmit={handleSubmitConfirmPopup}
        handleClose={handleCloseModal}
      />
    </section>
  );
}
