'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/button/button';
import { Select } from '@/components/select/select';

import { ROUTES } from '@/routes/routes.handler';

import { Article } from '@/api/types/article.types';
import { ArticleVersionDto } from '@/api/dto/article.dto';

import styles from './article-bar.module.scss';
import { useMemo } from 'react';

type ArticleBarProps = {
  language: string;
  article: Article;

  selectedArticleVersion: ArticleVersionDto;
  latestVersion: number;
  setSelectedVersion: (version: number) => void;

  languages: {
    label: string;
    value: string;
  }[];
};

type FormValues = { language: string };

export function ArticleBar(props: ArticleBarProps) {
  const {
    selectedArticleVersion,
    latestVersion,
    setSelectedVersion,
    language,
    article,
    languages,
  } = props;

  const router = useRouter();

  const { register, handleSubmit, getValues } = useForm<FormValues>({
    values: {
      language,
    },
  });

  const onLanguageChange = (data: FormValues) => {
    router.push(
      ROUTES.articleLanguageHistory(article.languagesMap[data.language].name_key, data.language)
    );
  };

  const isFirstVersion = useMemo(
    () => selectedArticleVersion.version === 1,
    [selectedArticleVersion]
  );

  const isLastVersion = useMemo(
    () => selectedArticleVersion.version === latestVersion,
    [selectedArticleVersion, latestVersion]
  );

  const handleNextVersionClick = () => {
    if (!isLastVersion) {
      setSelectedVersion(selectedArticleVersion.version + 1);
    }
  };

  const handlePreviousVersionClick = () => {
    if (!isFirstVersion) {
      setSelectedVersion(selectedArticleVersion.version - 1);
    }
  };

  const handleEditClick = () => {
    const language = getValues().language;

    router.push(ROUTES.articleLanguage(article.languagesMap[language].name_key, language));
  };

  return (
    <section className={styles.articleBar}>
      <div className={styles.headingWrapper}>History</div>
      <div className={styles.headingWrapper}>Name: {selectedArticleVersion.name}</div>

      <Button onClick={handlePreviousVersionClick} label='Previous' />
      <div className={styles.headingWrapper}>{selectedArticleVersion.version}</div>
      <Button onClick={handleNextVersionClick} label='Next' />

      <div className={styles.controlPanel}>
        <Button onClick={handleEditClick} label='Edit' />

        <Select
          formRegister={register('language')}
          onChange={handleSubmit(onLanguageChange)}
          options={languages}
        />
      </div>
    </section>
  );
}
