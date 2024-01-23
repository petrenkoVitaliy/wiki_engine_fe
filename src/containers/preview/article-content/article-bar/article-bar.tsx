'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import { Select } from '@/components/select/select';

import { ROUTES } from '@/routes/routes.handler';
import { Article } from '@/api/types/article.types';

import styles from './article-bar.module.scss';

type ArticleBarProps = {
  language: string;
  article: Article;

  languages: {
    label: string;
    value: string;
  }[];
};

type FormValues = { language: string };

export function ArticleBar(props: ArticleBarProps) {
  const { language, languages } = props;

  const router = useRouter();

  const { register, handleSubmit } = useForm<FormValues>({
    values: {
      language,
    },
  });

  const onLanguageChange = (data: FormValues) => {
    router.push(ROUTES.main(data.language));
  };

  return (
    <section className={styles.articleBar}>
      <div className={styles.elementsWrapper}>
        <Select
          formRegister={register('language')}
          onChange={handleSubmit(onLanguageChange)}
          options={languages}
          label='Language:'
          name='language'
        />
      </div>
    </section>
  );
}
