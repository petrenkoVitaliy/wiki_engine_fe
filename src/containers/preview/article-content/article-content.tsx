'use client';

import { useContext, useMemo } from 'react';

import { WysiwygViewer } from '@/containers/wysiwyg/wysiwyg-viewer';

import { useTruthSource } from '@/hooks/truth-source.hook';

import styles from './article-content.module.scss';
import { ArticlePreviewContext } from '@/context/article-preview-context';
import { ArticleBar } from './article-bar/article-bar';
import { ApiMapper } from '@/mappers/api.mapper';

export function ArticleContent() {
  const articleContext = useContext(ArticlePreviewContext);

  if (!articleContext) {
    return null;
  }

  const article = useTruthSource({
    propSource: articleContext.article,
    storeSelector: (store) => store.editorReducer.article,
  });

  const languages = useMemo(() => {
    return ApiMapper.getLanguageOptionsFromArticle(article);
  }, [article]);

  const selectedArticleVersion = useMemo(() => {
    return article.languagesMap[articleContext.language].version;
  }, [article, articleContext.language]);

  return (
    <section className={styles.articleContent}>
      <section className={styles.articleBody}>
        <ArticleBar article={article} languages={languages} language={articleContext.language} />
        <WysiwygViewer articleVersion={selectedArticleVersion} />
      </section>
    </section>
  );
}
