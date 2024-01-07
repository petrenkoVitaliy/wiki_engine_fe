'use client';

import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Id, toast, Flip } from 'react-toastify';
import { useRouter } from 'next/navigation';

import { useAppDispatch } from '@/redux/hooks';
import { toggleEditMode, editArticle, updateArticleType } from '@/redux/stores/editor';
import { EDITOR_REQUEST_TOAST } from '@/redux/consts';
import { ToastRequestOptions } from '@/redux/types';

import { ConfirmationModal } from '@/components/confirmation-modal/confirmation-modal';
import { IconButton } from '@/components/icon-button/icon-button';

import { EditorHandler } from '@/containers/wysiwyg/handlers/editor-handler/editor.handler';
import { CustomElement } from '@/containers/wysiwyg/types';

import { ICONS } from '@/icons';

import { ROUTES } from '@/routes/routes.handler';
import { Article, ArticleType } from '@/api/types/article.types';
import { ArticlePermission } from '@/api/dto/auth.dto';
import { useModalControls } from '@/hooks/modal-controls.hook';
import { PermissionControl } from '@/permission/permission-control.hoc';
import { PermissionHandler } from '@/permission/permission.handler';

import { EditArticleBarForm, FormValues } from './edit-article-bar-form/edit-article-bar-form';

import 'react-toastify/dist/ReactToastify.css';
import styles from './edit-article-bar.module.scss';

type ArticleBarProps = {
  article: Article;
  isEditMode: boolean;
  language: string;
  editorHandler: EditorHandler;
  permissions: ArticlePermission[];
};

const ARTICLE_EDIT_PERMISSIONS: ArticlePermission[] = ['Edit'];

export function EditArticleBar(props: ArticleBarProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { isOpened, handleCloseModal, handleOpenModal } = useModalControls();

  const articleName = useMemo(() => {
    const { article, language } = props;

    return article.languagesMap[language].name;
  }, [props.article, props.language]);

  const isPatchEnabled = useMemo(() => {
    return PermissionHandler.isPermissionMatch({
      requiredPermissions: ['Patch'],
      permissions: props.permissions,
    });
  }, [props.permissions]);

  const { getValues, watch, control } = useForm<FormValues>({
    defaultValues: {
      language: props.language,
      title: articleName,
      articleType: props.article.article_type,
    },
  });

  const handleResponse = (
    article: Article | null,
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

      const newArticleLanguage = article.languagesMap[props.language];
      if (newArticleLanguage.name !== articleName) {
        router.push(ROUTES.articleLanguage(newArticleLanguage.name_key, props.language));
      }
    } else {
      toast.update(toastId, {
        render: tostOptions.message,
        type: tostOptions.type,
        isLoading: false,
      });
    }
  };

  const handleHistoryOpen = () => {
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

  const onLanguageChange = (language: string) => {
    router.push(ROUTES.articleLanguage(props.article.languagesMap[language].name_key, language));
  };

  const onArticleTypeChange = (articleType: ArticleType) => {
    const toastOptions = EDITOR_REQUEST_TOAST.UPDATING_ARTICLE;
    const toastId = toast(toastOptions.message, { type: toastOptions.type, isLoading: true });

    dispatch(
      updateArticleType({
        articleType,
        storedArticle: props.article,
        callback: (article: Article | null, tostOptions: ToastRequestOptions) =>
          handleResponse(article, tostOptions, toastId),
      })
    );
  };

  const handleSaveArticle = () => {
    handleCloseModal();

    const { article, language } = props;
    const { title } = getValues();

    const elements = props.editorHandler.editor.children as CustomElement[];

    const toastOptions = EDITOR_REQUEST_TOAST.UPDATING_ARTICLE;
    const toastId = toast(toastOptions.message, { type: toastOptions.type, isLoading: true });

    dispatch(
      editArticle({
        elements,
        id: article.id,
        language: language,
        callback: (article: Article | null, tostOptions: ToastRequestOptions) =>
          handleResponse(article, tostOptions, toastId),
        storedArticle: article,
        name: title !== articleName ? title : undefined,
      })
    );
  };

  return (
    <section className={styles.articleBar}>
      <EditArticleBarForm
        watch={watch}
        control={control}
        isPatchEnabled={isPatchEnabled}
        isEditMode={props.isEditMode}
        article={props.article}
        onLanguageChange={onLanguageChange}
        onArticleTypeChange={onArticleTypeChange}
        handleAddLanguage={handleAddLanguage}
        permissions={props.permissions}
        editPermissions={ARTICLE_EDIT_PERMISSIONS}
      />

      <div className={styles.controlsContainer}>
        {props.isEditMode ? (
          <>
            <IconButton onClick={handleOpenModal} label='Save' icon={ICONS.BUTTON.saveIcon} />
            <IconButton onClick={handleEditMode} label='Cancel' icon={ICONS.BUTTON.cancelIcon} />
          </>
        ) : (
          <>
            <IconButton
              onClick={handleHistoryOpen}
              label='History'
              icon={ICONS.BUTTON.historyIcon}
            />
            <PermissionControl
              permissions={props.permissions}
              requiredPermissions={ARTICLE_EDIT_PERMISSIONS}
            >
              <IconButton onClick={handleEditMode} label='Edit' icon={ICONS.BUTTON.editIcon} />
            </PermissionControl>
          </>
        )}
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
