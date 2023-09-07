'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/button/button';
import { Select } from '@/components/select/select';

import { ROUTES } from '@/routes/routes.handler';

import { Article } from '@/api/types/article.types';

import styles from './article-bar.module.scss';
import { useMemo } from 'react';

type ArticleBarProps = {
  language: string;
  article: Article;

  selectedVersion: number;
  latestVersion: number;
  setSelectedVersion: (version: number) => void;

  languages: {
    label: string;
    value: string;
  }[];
};

type FormValues = { language: string };

export function ArticleBar(props: ArticleBarProps) {
  const { selectedVersion, latestVersion, setSelectedVersion, language, article, languages } =
    props;

  const router = useRouter();

  const { register, handleSubmit, getValues } = useForm<FormValues>({
    values: {
      language,
    },
  });

  const onLanguageChange = (data: FormValues) => {
    router.push(ROUTES.articleLanguageHistory(data.language, article.id));
  };

  const isFirstVersion = useMemo(() => selectedVersion === 1, [selectedVersion]);
  const isLastVersion = useMemo(
    () => selectedVersion === latestVersion,
    [selectedVersion, latestVersion]
  );

  const handleNextVersionClick = () => {
    if (!isLastVersion) {
      setSelectedVersion(selectedVersion + 1);
    }
  };

  const handlePreviousVersionClick = () => {
    if (!isFirstVersion) {
      setSelectedVersion(selectedVersion - 1);
    }
  };

  const handleEditClick = () => {
    const language = getValues().language;

    router.push(ROUTES.articleLanguage(language, article.id));
  };

  return (
    <section className={styles.articleBar}>
      <div className={styles.headingWrapper}>History</div>

      <Button onClick={handlePreviousVersionClick} label='Previous' />
      <div className={styles.headingWrapper}>{selectedVersion}</div>
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
