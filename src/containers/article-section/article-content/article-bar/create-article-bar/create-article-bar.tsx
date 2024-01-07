'use client';

import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Flip, Id, toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

import { createArticle, createArticleLanguage } from '@/redux/stores/editor';
import { useAppDispatch } from '@/redux/hooks';
import { EDITOR_REQUEST_TOAST } from '@/redux/consts';
import { ToastRequestOptions } from '@/redux/types';

import { ControlledResponsiveInput } from '@/components/responsive-input/controlled-responsive-input';
import { ControlledSelect } from '@/components/select/controlled-select';
import { ConfirmationModal } from '@/components/confirmation-modal/confirmation-modal';
import { IconButton } from '@/components/icon-button/icon-button';

import { EditorHandler } from '@/containers/wysiwyg/handlers/editor-handler/editor.handler';
import { CustomElement } from '@/containers/wysiwyg/types';

import { LanguageDto } from '@/api/dto/article.dto';
import { Article } from '@/api/types/article.types';

import { ICONS } from '@/icons';
import { ROUTES } from '@/routes/routes.handler';
import { useModalControls } from '@/hooks/modal-controls.hook';

import 'react-toastify/dist/ReactToastify.css';
import styles from './create-article-bar.module.scss';

type FormValues = { language: string; title: string };

type ArticleBarProps = {
  languages: LanguageDto[];
  editorHandler: EditorHandler;
  article: Article | null;
};

export function CreateArticleBar(props: ArticleBarProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { getValues, control, watch } = useForm<FormValues>({
    defaultValues: {
      title: '',
      language: props.languages[0].code,
    },
  });

  const titleSubscription = watch('title');

  const { isOpened, handleCloseModal, handleOpenModal } = useModalControls();

  const languageOptions = useMemo(() => {
    return props.languages.map(({ code }) => ({
      value: code,
      label: code,
    }));
  }, [props.languages]);

  const handleSubmit = () => {
    handleOpenModal();
  };

  const handleBack = () => {
    router.back();
  };

  const handleSubmitCreate = () => {
    handleCloseModal();

    const values = getValues();

    if (!values.title) {
      toast('Title is mandatory', { type: 'error' });
      return;
    }

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

    const toastOptions = EDITOR_REQUEST_TOAST.CREATING_ARTICLE;
    const toastId = toast(toastOptions.message, { type: toastOptions.type, isLoading: true });

    if (props.article) {
      dispatch(
        createArticleLanguage({
          id: props.article.id,
          elements: props.editorHandler.editor.children as CustomElement[],
          language: values.language,
          name: values.title,
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
          name: values.title,
          callback: (article: Article | null, language: string, tostOptions: ToastRequestOptions) =>
            handleCreateArticle(article, language, tostOptions, toastId),
        })
      );
    }
  };

  return (
    <section className={styles.articleBar}>
      <div className={styles.headingWrapper}>
        <ControlledResponsiveInput
          control={control}
          name='title'
          ariaName='article title'
          value={titleSubscription}
          highlighted
          minWidth={150}
          maxWidth={350}
          placeholder='Title...'
          hoverBorder
        />
      </div>

      <div className={styles.controlPanel}>
        <div className={styles.selectsPanel}>
          <ControlledSelect
            control={control}
            options={languageOptions}
            name='language'
            ariaName='language'
            label='Language:'
          />
        </div>

        <div className={styles.buttonsPanel}>
          <IconButton onClick={handleBack} label='Back' icon={ICONS.BUTTON.cancelIcon} />
          <IconButton onClick={handleSubmit} label='Save' icon={ICONS.BUTTON.saveIcon} />
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
