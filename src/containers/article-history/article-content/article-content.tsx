import { useContext, useMemo, useState } from 'react';

import { ApiMapper } from '@/mappers/api.mapper';

import { WysiwygViewer } from '@/containers/wysiwyg/wysiwyg-viewer';

import { useTruthSource } from '@/hooks/truth-source.hook';

import { ArticleVersionContext } from '@/context/article-version-context';

import { ArticleBar } from './article-bar/article-bar';

import styles from './article-content.module.scss';
import { ArticleVersionDto } from '@/api/dto/article.dto';

export function ArticleContent() {
  const articleContext = useContext(ArticleVersionContext);

  if (!articleContext || articleContext.versions.length < 1) {
    return null;
  }

  const article = useTruthSource({
    propSource: articleContext.article,
    storeSelector: (store) => store.editorReducer.article,
  });

  const articleVersionsMap = useMemo(
    () =>
      articleContext.versions.reduce<{ [version: number]: ArticleVersionDto }>(
        (acc, articleVersion) => {
          acc[articleVersion.version] = articleVersion;

          return acc;
        },
        {}
      ),
    [articleContext.versions]
  );

  const preSelectedVersion = useMemo(
    () =>
      articleContext.selectedVersion
        ? articleVersionsMap[articleContext.selectedVersion]?.version || null
        : null,
    [articleContext.selectedVersion, articleVersionsMap]
  );

  const latestVersion = useMemo(
    () => article.languagesMap[articleContext.language].version.version,
    [article, articleContext.language]
  );

  const [selectedVersion, setSelectedVersion] = useState<number>(
    preSelectedVersion || latestVersion
  );

  const selectedArticleVersion = useMemo(() => {
    return articleVersionsMap[selectedVersion];
  }, [articleVersionsMap, selectedVersion]);

  const languages = useMemo(() => {
    return ApiMapper.getLanguageOptionsFromArticle(article);
  }, [article]);

  return (
    <section className={styles.articleContent}>
      <ArticleBar
        languages={languages}
        language={articleContext.language}
        article={article}
        selectedArticleVersion={selectedArticleVersion}
        setSelectedVersion={setSelectedVersion}
        latestVersion={latestVersion}
      />

      <section className={styles.articleBody}>
        <WysiwygViewer articleVersion={selectedArticleVersion} />
      </section>
    </section>
  );
}
