'use client';

import { useContext, useMemo } from 'react';
import { useForm } from 'react-hook-form';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { toggleReadOnly } from '@/redux/slices/editor.slice';

import { HeadingContainer } from '@/components/heading-container/heading-container';
import { Select } from '@/components/select/select';
import { Button } from '@/components/button/button';

import styles from './article-bar.module.scss';
import { useRouter } from 'next/navigation';
import { ArticleContext } from '../../../../../../context/article-context';
import { ROUTES } from '@/routes/routes.handler';

type FormValues = { language: string };

export function ArticleBar() {
  const articleContext = useContext(ArticleContext);
  if (!articleContext) return null;

  const router = useRouter();
  const dispatch = useAppDispatch();

  const isReadOnly = useAppSelector((state) => state.editorReducer.isReadOnly);

  const { register, handleSubmit } = useForm<FormValues>({
    defaultValues: { language: articleContext.article.language.language.code },
  });

  const articleOptions = useMemo(() => {
    const { article } = articleContext;

    const languageOptions =
      article.otherLanguages.map((languageCode) => ({
        value: languageCode,
        label: languageCode,
      })) || [];

    const selectedLanguage = article.language.language.code;

    languageOptions.push({
      label: selectedLanguage,
      value: selectedLanguage,
    });

    return {
      articleId: article.id,
      articleName: article.language.name,
      selectedLanguage: selectedLanguage,
      languageOptions,
    };
  }, [articleContext]);

  const onLanguageChange = (data: FormValues) => {
    if (articleOptions.articleId) {
      router.push(ROUTES.articleLanguage(data.language, articleOptions.articleId));
    }
  };

  const handleEditClick = () => {
    dispatch(toggleReadOnly());
  };

  return (
    <section className={styles.articleBar}>
      <HeadingContainer articleName={articleOptions.articleName} />
      <div className={styles.controlPanel}>
        <Select
          formRegister={register('language')}
          onChange={handleSubmit(onLanguageChange)}
          options={articleOptions.languageOptions}
        />

        <Button onClick={handleEditClick} label={isReadOnly ? 'Edit' : 'Save'} />
      </div>
    </section>
  );
}
