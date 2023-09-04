import { Article } from '@/api/types/article.types';
import { createServerContext } from 'react';

export const ArticleContext = createServerContext<{
  article: Article;
} | null>('article_context', null);
