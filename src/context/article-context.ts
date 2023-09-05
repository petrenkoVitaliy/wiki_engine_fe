import { createServerContext } from 'react';

import { LanguageDto } from '@/api/dto/article.dto';
import { Article } from '@/api/types/article.types';

export enum ArticleEditMode {
  Creation = 'Creation',
  Edit = 'Edit',
  LanguageCreation = 'LanguageCreation',
}

export const ArticleContext = createServerContext<{
  article: Article | null;
  languages: LanguageDto[];
  mode: ArticleEditMode;
} | null>('article_context', null);
