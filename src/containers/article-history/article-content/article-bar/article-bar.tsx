'use client';

import { useEffect, useMemo } from 'react';
import { DeepPartial, FieldPath, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import { IconButton } from '@/components/icon-button/icon-button';

import { ROUTES } from '@/routes/routes.handler';
import { formatDateTime } from '@/utils/utils';

import { ICONS } from '@/icons';
import { Article } from '@/api/types/article.types';
import { ArticleVersionDto } from '@/api/dto/article.dto';

import styles from './article-bar.module.scss';
import { ControlledSelect } from '@/components/select/controlled-select';

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

  const { control, watch } = useForm<FormValues>({
    defaultValues: {
      language,
    },
  });

  const languageSubscription = watch('language');

  useEffect(() => {
    const subscription = watch(handleFormChange);

    return () => subscription.unsubscribe();
  }, [watch]);

  const handleFormChange = (
    formValues: DeepPartial<FormValues>,
    {
      name,
    }: {
      name?: FieldPath<FormValues>;
    }
  ) => {
    switch (name) {
      case 'language':
        onLanguageChange(formValues.language as string);
        break;
    }
  };

  const onLanguageChange = (language: string) => {
    router.push(ROUTES.articleLanguageHistory(article.languagesMap[language].name_key, language));
  };

  const authorName = useMemo(
    () => selectedArticleVersion.created_by?.name,
    [selectedArticleVersion]
  );

  const formattedUpdateDate = useMemo(
    () => formatDateTime(selectedArticleVersion.created_at),
    [selectedArticleVersion]
  );

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
    router.push(
      ROUTES.articleLanguage(article.languagesMap[language].name_key, languageSubscription)
    );
  };

  return (
    <section className={styles.articleBar}>
      <div className={styles.headingWrapper}>Article Version History</div>
      <div className={styles.elementsWrapper}>
        <div className={styles.infoWrapper}>
          <div className={styles.infoBlock}>
            Title: <span>{selectedArticleVersion.name}</span>
          </div>
          <div className={styles.infoBlock}>
            Author:
            <span>{authorName}</span>
          </div>
          <div className={styles.infoBlock}>
            Creation time:
            <span suppressHydrationWarning>{formattedUpdateDate}</span>
          </div>
        </div>

        <div className={styles.controlsWrapper}>
          <div className={styles.inputsWrapper}>
            <ControlledSelect
              control={control}
              options={languages}
              name='language'
              ariaName='language'
              label='Language:'
            />

            <IconButton
              onClick={handleEditClick}
              label='Back to article'
              icon={ICONS.BUTTON.cancelIcon}
              collapsable
              className={styles.backArrow}
            />
          </div>
          <div className={styles.versionControlsWrapper}>
            <IconButton
              onClick={handlePreviousVersionClick}
              label='Previous'
              icon={ICONS.BUTTON.leftIcon}
              simple
              className={styles.leftArrow}
            />
            <div className={styles.versionBlock}>
              {`${selectedArticleVersion.version}/${latestVersion}`}
            </div>
            <IconButton
              onClick={handleNextVersionClick}
              label='Next'
              icon={ICONS.BUTTON.rightIcon}
              simple
              className={styles.rightArrow}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
