'use client';

import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

import { Select } from '@/components/select/select';
import { Button } from '@/components/button/button';
import { ConfirmationModal } from '@/components/confirmation-modal/confirmation-modal';
import { Input } from '@/components/input/input';

import { createArticle, createArticleLanguage } from '@/redux/stores/editor';
import { useAppDispatch } from '@/redux/hooks';

import { EditorHandler } from '@/containers/wysiwyg/handlers/editor-handler/editor.handler';

import { LanguageDto } from '@/api/dto/article.dto';
import { Article } from '@/api/types/article.types';

import { ROUTES } from '@/routes/routes.handler';
import { useModalControls } from '@/hooks/modal-controls.hook';

import 'react-toastify/dist/ReactToastify.css';
import styles from './article-bar.module.scss';
import { CustomElement } from '@/containers/wysiwyg/types';

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

  const handleSubmit = () => {
    handleOpenModal();
  };

  const handleCreateArticle = (article: Article | null, language: string) => {
    if (article) {
      toast('Article was successfully created', { type: 'success' });

      router.push(ROUTES.articleLanguage(article.languagesMap[language].name_key, language));
    } else {
      toast('Failed to save article', { type: 'error' });
    }
  };

  const handleSubmitCreate = () => {
    handleCloseModal();

    const values = getValues();

    if (props.article) {
      dispatch(
        createArticleLanguage({
          id: props.article.id,
          elements: props.editorHandler.editor.children as CustomElement[],
          language: values.language,
          name: values.name,
          storedArticle: props.article,
          callback: handleCreateArticle,
        })
      );
    } else {
      dispatch(
        createArticle({
          elements: props.editorHandler.editor.children as CustomElement[],
          language: values.language,
          name: values.name,
          callback: handleCreateArticle,
        })
      );
    }
  };

  return (
    <section className={styles.articleBar}>
      <div className={styles.headingWrapper}>
        <Input formRegister={register('name')} />
      </div>

      <div className={styles.controlPanel}>
        <Select formRegister={register('language')} options={articleOptions.languageOptions} />

        <Button onClick={handleSubmit} label='Save' />
      </div>

      <ConfirmationModal
        isOpened={isOpened}
        label='Are you sure you want to create article?'
        cancelLabel='No'
        submitLabel='Yes'
        handleSubmit={handleSubmitCreate}
        handleClose={handleCloseModal}
      />
    </section>
  );
}
