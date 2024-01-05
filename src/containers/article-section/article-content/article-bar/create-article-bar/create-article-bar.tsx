'use client';

import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Flip, Id, toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

import { createArticle, createArticleLanguage } from '@/redux/stores/editor';
import { useAppDispatch } from '@/redux/hooks';
import { EDITOR_REQUEST_TOAST } from '@/redux/consts';
import { ToastRequestOptions } from '@/redux/types';

import { Select } from '@/components/select/select';
import { Button } from '@/components/button/button';
import { ConfirmationModal } from '@/components/confirmation-modal/confirmation-modal';
import { Input } from '@/components/input/input';

import { EditorHandler } from '@/containers/wysiwyg/handlers/editor-handler/editor.handler';
import { CustomElement } from '@/containers/wysiwyg/types';

import { LanguageDto } from '@/api/dto/article.dto';
import { Article } from '@/api/types/article.types';

import { ROUTES } from '@/routes/routes.handler';
import { useModalControls } from '@/hooks/modal-controls.hook';

import 'react-toastify/dist/ReactToastify.css';
import styles from './create-article-bar.module.scss';

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

  const handleCreateArticle = (
    article: Article | null,
    language: string,
    tostOptions: ToastRequestOptions,
    toastId: Id
  ) => {
    if (article) {
      toast.update(toastId, {
        render: tostOptions.message,
        type: tostOptions.type,
        isLoading: false,
        transition: Flip,
        autoClose: 2000,
      });

      router.push(ROUTES.articleLanguage(article.languagesMap[language].name_key, language));
    } else {
      toast.update(toastId, {
        render: tostOptions.message,
        type: tostOptions.type,
        isLoading: false,
      });
    }
  };

  const handleSubmitCreate = () => {
    handleCloseModal();

    const values = getValues();

    if (!values.name) {
      toast('Name is mandatory', { type: 'error' });
      return;
    }

    const toastOptions = EDITOR_REQUEST_TOAST.CREATING_ARTICLE;
    const toastId = toast(toastOptions.message, { type: toastOptions.type, isLoading: true });

    if (props.article) {
      dispatch(
        createArticleLanguage({
          id: props.article.id,
          elements: props.editorHandler.editor.children as CustomElement[],
          language: values.language,
          name: values.name,
          storedArticle: props.article,
          callback: (article: Article | null, language: string, tostOptions: ToastRequestOptions) =>
            handleCreateArticle(article, language, tostOptions, toastId),
        })
      );
    } else {
      dispatch(
        createArticle({
          elements: props.editorHandler.editor.children as CustomElement[],
          language: values.language,
          name: values.name,
          callback: (article: Article | null, language: string, tostOptions: ToastRequestOptions) =>
            handleCreateArticle(article, language, tostOptions, toastId),
        })
      );
    }
  };

  return (
    <section className={styles.articleBar}>
      <div className={styles.headingWrapper}>
        <Input
          hoverBorder
          formRegister={register('name')}
          placeholder='Title'
          name='article title'
        />
      </div>

      <div className={styles.controlPanel}>
        <div className={styles.selectsPanel}>
          <Select
            formRegister={register('language')}
            options={articleOptions.languageOptions}
            name='language'
          />
        </div>

        <div className={styles.buttonsPanel}>
          <Button onClick={handleSubmit} label='Save' />
        </div>
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
