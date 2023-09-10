import { ArticleType } from '../types/article.types';

export type ArticleDto = {
  id: number;
  enabled: boolean;
  archived: boolean;
  article_type: ArticleType;

  updated_at?: string;
  created_at: string;

  languages: ArticleLanguageDto[];
};

export type ArticleLanguageDto = {
  id: number;
  name: string;
  name_key: string;

  enabled: boolean;
  archived: boolean;
  updated_at?: string;
  created_at: string;

  language: LanguageDto;
  version: ArticleVersionDto;
};

export type VersionContentDto = {
  id: number;
  content: string;
};

export type ArticleVersionDto = {
  id: number;
  version: number;
  name: string;
  enabled: boolean;

  content: VersionContentDto;

  updated_at?: string;
  created_at: string;

  article_language_id: number;
};

export type LanguageDto = {
  id: number;
  code: string;
};
