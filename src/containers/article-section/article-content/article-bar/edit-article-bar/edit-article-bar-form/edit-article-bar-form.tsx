'use client';

import { useEffect, useMemo } from 'react';
import { Control, DeepPartial, EventType, FieldPath, UseFormWatch } from 'react-hook-form';

import { ControlledSelect } from '@/components/select/controlled-select';
import { ControlledResponsiveInput } from '@/components/responsive-input/controlled-responsive-input';
import { IconButton } from '@/components/icon-button/icon-button';

import { ApiMapper } from '@/mappers/api.mapper';
import { PermissionControl } from '@/permission/permission-control.hoc';

import { ArticlePermission } from '@/api/dto/auth.dto';
import { Article, ArticleType, articleTypesOptions } from '@/api/types/article.types';

import { ICONS } from '@/icons';

import styles from '../edit-article-bar.module.scss';

export type FormValues = { language: string; title: string; articleType: ArticleType };

type EditArticleBarFormProps = {
  watch: UseFormWatch<FormValues>;
  control: Control<FormValues>;

  isEditMode: boolean;
  isPatchEnabled: boolean;
  article: Article;
  permissions: ArticlePermission[];
  editPermissions: ArticlePermission[];

  onLanguageChange: (language: string) => void;
  onArticleTypeChange: (articleType: ArticleType) => void;
  handleAddLanguage: () => void;
};

export function EditArticleBarForm(props: EditArticleBarFormProps) {
  const languageOptions = useMemo(() => {
    const { article } = props;

    return ApiMapper.getLanguageOptionsFromArticle(article);
  }, [props.article]);

  const titleSubscription = props.watch('title');

  useEffect(() => {
    const subscription = props.watch(handleFormChange);

    return () => subscription.unsubscribe();
  }, [props.watch]);

  const handleFormChange = (
    formValues: DeepPartial<FormValues>,
    {
      name,
    }: {
      name?: FieldPath<FormValues>;
      type?: EventType;
    }
  ) => {
    switch (name) {
      case 'language':
        props.onLanguageChange(formValues.language as string);
        break;
      case 'articleType':
        props.onArticleTypeChange(formValues.articleType as ArticleType);
        break;
    }
  };

  return (
    <div className={styles.headingContainer}>
      <ControlledResponsiveInput
        control={props.control}
        disabled={!props.isEditMode}
        name='title'
        ariaName='article title'
        value={titleSubscription}
        highlighted
        minWidth={80}
        maxWidth={350}
        placeholder='Title...'
      />

      <div className={styles.selectsWrapper}>
        <ControlledSelect
          control={props.control}
          options={articleTypesOptions}
          disabled={!props.isPatchEnabled}
          name='articleType'
          ariaName='article type'
          label='Can be edited by:'
        />

        <ControlledSelect
          control={props.control}
          options={languageOptions}
          label='Language:'
          name='language'
          ariaName='language'
          className={styles.borderlessSelect}
          collapsable
        />

        <PermissionControl
          permissions={props.permissions}
          requiredPermissions={props.editPermissions}
        >
          <IconButton
            onClick={props.handleAddLanguage}
            label='Add'
            icon={ICONS.BUTTON.addIcon}
            simple
          />
        </PermissionControl>
      </div>
    </div>
  );
}
