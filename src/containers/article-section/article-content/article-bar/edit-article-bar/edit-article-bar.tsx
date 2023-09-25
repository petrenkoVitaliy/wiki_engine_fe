'use client';

import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Id, toast, Flip } from 'react-toastify';
import { useRouter } from 'next/navigation';

import { useAppDispatch } from '@/redux/hooks';
import { toggleEditMode, editArticle, updateArticleType } from '@/redux/stores/editor';
import { EDITOR_REQUEST_TOAST } from '@/redux/consts';
import { ToastRequestOptions } from '@/redux/types';

import { Select } from '@/components/select/select';
import { Button } from '@/components/button/button';
import { ConfirmationModal } from '@/components/confirmation-modal/confirmation-modal';
import { Input } from '@/components/input/input';

import { EditorHandler } from '@/containers/wysiwyg/handlers/editor-handler/editor.handler';
import { CustomElement } from '@/containers/wysiwyg/types';

import { ROUTES } from '@/routes/routes.handler';
import { ApiMapper } from '@/mappers/api.mapper';
import { Article, ArticleType, articleTypesOptions } from '@/api/types/article.types';
import { ArticlePermission } from '@/api/dto/auth.dto';
import { useModalControls } from '@/hooks/modal-controls.hook';
import { PermissionControl } from '@/permission/permission-control.hoc';
import { PermissionHandler } from '@/permission/permission.handler';

import 'react-toastify/dist/ReactToastify.css';
import styles from './edit-article-bar.module.scss';

type FormValues = { language: string; name: string; articleType: ArticleType };

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

  const articleOptions = useMemo(() => {
    const { article, language } = props;

    const languageOptions = ApiMapper.getLanguageOptionsFromArticle(article);

    return {
      languageOptions,
      articleName: article.languagesMap[language].name,
    };
  }, [props.article, props.language]);

  const isPatchEnabled = useMemo(() => {
    return PermissionHandler.isPermissionMatch({
      requiredPermissions: ['Patch'],
      permissions: props.permissions,
    });
  }, [props.permissions]);

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
      if (newArticleLanguage.name !== articleOptions.articleName) {
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

  const onArticleTypeChange = (data: FormValues) => {
    const toastOptions = EDITOR_REQUEST_TOAST.UPDATING_ARTICLE;
    const toastId = toast(toastOptions.message, { type: toastOptions.type, isLoading: true });

    dispatch(
      updateArticleType({
        articleType: data.articleType,
        storedArticle: props.article,
        callback: (article: Article | null, tostOptions: ToastRequestOptions) =>
          handleResponse(article, tostOptions, toastId),
      })
    );
  };

  const handleSaveArticle = () => {
    handleCloseModal();

    const { article, language } = props;
    const { name } = getValues();

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
        name: name !== articleOptions.articleName ? name : undefined,
      })
    );
  };

  return (
    <section className={styles.articleBar}>
      <div className={styles.headingWrapper}>
        <Input
          hoverBorder
          formRegister={register('name')}
          disabled={!props.isEditMode}
          highlighted
        />
      </div>

      <div className={styles.controlPanel}>
        <div className={styles.selectsPanel}>
          <Select
            formRegister={register('articleType')}
            onChange={handleSubmit(onArticleTypeChange)}
            options={articleTypesOptions}
            disabled={!isPatchEnabled}
          />

          <Select
            formRegister={register('language')}
            onChange={handleSubmit(onLanguageChange)}
            options={articleOptions.languageOptions}
            label='Language:'
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
              <PermissionControl
                permissions={props.permissions}
                requiredPermissions={ARTICLE_EDIT_PERMISSIONS}
              >
                <Button onClick={handleAddLanguage} label='Add language' />
                <Button onClick={handleEditMode} label='Edit' />
              </PermissionControl>
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
