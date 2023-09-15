'use client';

import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/button/button';
import { Select } from '@/components/select/select';

import { ROUTES } from '@/routes/routes.handler';
import { formatDateTime } from '@/utils/utils';

import { Article } from '@/api/types/article.types';
import { ArticleVersionDto } from '@/api/dto/article.dto';

import styles from './article-bar.module.scss';

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

  const formattedUpdateDate = useMemo(
    () => formatDateTime(selectedArticleVersion.created_at),
    [selectedArticleVersion]
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
      <div className={styles.headingWrapper}>Article Version History</div>
      <div className={styles.elementsWrapper}>
        <div className={styles.infoWrapper}>
          <div className={styles.infoBlock}>
            Title: <span>{selectedArticleVersion.name}</span>
          </div>
          {/* <div className={styles.infoBlock}> TODO
            Author:
            <span>Author</span>
          </div> */}
          <div className={styles.infoBlock}>
            Creation time:
            <span>{formattedUpdateDate}</span>
          </div>
        </div>

        <div className={styles.controlsWrapper}>
          <div className={styles.inputsWrapper}>
            <Select
              formRegister={register('language')}
              onChange={handleSubmit(onLanguageChange)}
              options={languages}
              label='Language:'
            />

            <Button onClick={handleEditClick} label='Return to article' />
          </div>
          <div className={styles.versionControlsWrapper}>
            <Button onClick={handlePreviousVersionClick} label='Previous' />
            <div
              className={styles.versionBlock}
            >{`${selectedArticleVersion.version}/${latestVersion}`}</div>
            <Button onClick={handleNextVersionClick} label='Next' />
          </div>
        </div>
      </div>
    </section>
  );
}
