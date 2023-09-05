import { createServerContext } from 'react';

import { LanguageDto } from '@/api/dto/article.dto';
import { Article } from '@/api/types/article.types';

export const ArticleContext = createServerContext<{
  article: Article | null;
  languages: LanguageDto[];
} | null>('article_context', null);
