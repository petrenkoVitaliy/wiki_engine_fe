import { createServerContext } from 'react';

import { Article } from '@/api/types/article.types';

export const ArticlePreviewContext = createServerContext<{
  article: Article;
  language: string;
} | null>('article_version_context', null);
