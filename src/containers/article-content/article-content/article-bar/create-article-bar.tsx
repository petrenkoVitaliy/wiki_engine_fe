'use client';

import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

import { Select } from '@/components/select/select';
import { Button } from '@/components/button/button';
import { ConfirmationModal } from '@/components/confirmation-modal/confirmation-modal';
import { Input } from '@/components/input/input';

import { createArticle, createArticleLanguage } from '@/redux/slices/editor.slice';
import { useAppDispatch } from '@/redux/hooks';

import { EditorHandler } from '@/containers/wysiwyg/handlers/editor-handler/editor.handler';

import { LanguageDto } from '@/api/dto/article.dto';
import { Article } from '@/api/types/article.types';

import { ROUTES } from '@/routes/routes.handler';
import { useModalControls } from '@/hooks/modal-controls.hook';

import 'react-toastify/dist/ReactToastify.css';
import styles from './article-bar.module.scss';

type FormValues = { language: string; name: string };

type ArticleBarProps = {
  languages: LanguageDto[];
  editorHandler: EditorHandler;
  article: Article | null;
};

export function CreateArticleBar(props: ArticleBarProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { register, getValues } = useForm<FormValues>();
  const { isOpened, handleCloseModal, handleOpenModal } = useModalControls();

  const articleOptions = useMemo(() => {
    const languageOptions = props.languages.map(({ code }) => ({
      value: code,
      label: code,
    }));

    return {
      languageOptions,
    };
  }, [props.languages]);

  const onSubmit = () => {
    handleOpenModal();
  };

  const handleCreateArticle = (article: Article | null) => {
    const values = getValues(); // TODO!!!
    if (article) {
      toast('Article was successfully created', { type: 'success' });

      router.push(ROUTES.articleLanguage(values.language, article.id));
    } else {
      toast('Failed to save article', { type: 'error' });
    }
  };

  const handleSubmitCreate = () => {
    handleCloseModal();

    const values = getValues();

    const content = JSON.stringify(props.editorHandler.editor.children);

    if (props.article) {
      dispatch(
        createArticleLanguage({
          id: props.article.id,
          content: content,
          language: values.language,
          name: values.name,
          storedArticle: props.article,
          callback: handleCreateArticle,
        })
      );
    } else {
      dispatch(
        createArticle({
          content: content,
          language: values.language,
          name: values.name,
          callback: handleCreateArticle,
        })
      );
    }
    // createArticleLanguage
  };

  return (
    <section className={styles.articleBar}>
      <div className={styles.headingWrapper}>
        <Input formRegister={register('name')} />
      </div>

      <div className={styles.controlPanel}>
        <Select formRegister={register('language')} options={articleOptions.languageOptions} />

        <Button onClick={onSubmit} label='Save' />
      </div>

      <ConfirmationModal
        isOpen={isOpened}
        label='Are you sure you want to create article?'
        cancelLabel='No'
        submitLabel='Yes'
        handleSubmit={handleSubmitCreate}
        handleClose={handleCloseModal}
      />
    </section>
  );
}
