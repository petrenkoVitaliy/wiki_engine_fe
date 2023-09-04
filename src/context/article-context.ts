import { LanguageDto } from '@/api/dto/article.dto';
import { Article } from '@/api/types/article.types';
import { createServerContext } from 'react';

export const ArticleContext = createServerContext<{
  article: Article | null;
  languages: LanguageDto[];
} | null>('article_context', null);
