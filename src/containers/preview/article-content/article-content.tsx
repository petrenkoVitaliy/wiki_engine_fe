'use client';

import { useMemo } from 'react';
import clsx from 'clsx';

import { WysiwygViewer } from '@/containers/wysiwyg/wysiwyg-viewer';

import { useTruthSource } from '@/hooks/truth-source.hook';

import styles from './article-content.module.scss';
import { ArticleBar } from './article-bar/article-bar';
import { ApiMapper } from '@/mappers/api.mapper';
import { Article } from '@/api/types/article.types';

type ArticleContentProps = {
  article: Article;
  language: string;
};

export function ArticleContent(props: ArticleContentProps) {
  const article = useTruthSource({
    propSource: props.article,
    storeSelector: (store) => store.editorReducer.article,
  });

  const languages = useMemo(() => {
    return ApiMapper.getLanguageOptionsFromArticle(article);
  }, [article]);

  const selectedArticleVersion = useMemo(() => {
    return article.languagesMap[props.language].version;
  }, [article, props.language]);

  return (
    <section className={styles.articleContent}>
      <section className={clsx(styles.articleBody, styles.preview)}>
        <ArticleBar article={article} languages={languages} language={props.language} />
        <WysiwygViewer articleVersion={selectedArticleVersion} />
      </section>
    </section>
  );
}
