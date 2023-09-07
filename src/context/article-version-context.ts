import { createServerContext } from 'react';

import { ArticleVersionDto } from '@/api/dto/article.dto';
import { Article } from '@/api/types/article.types';

export const ArticleVersionContext = createServerContext<{
  article: Article;
  language: string;
  selectedVersion: number | null;
  versions: ArticleVersionDto[];
} | null>('article_version_context', null);
