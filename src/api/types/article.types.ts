export type Article = {
  id: number;
  enabled: boolean;
  archived: boolean;
  article_type: ArticleType;

  updated_at?: string;
  created_at: string;

  language: ArticleLanguage;
  otherLanguages: string[];
};

export type ArticleLanguage = {
  id: number;
  name: string;
  enabled: boolean;
  archived: boolean;
  updated_at?: string;
  created_at: string;

  language: Language;
  version: ArticleVersion;
};

export type VersionContent = {
  id: number;
  content: string;
};

export type ArticleVersion = {
  id: number;
  version: number;
  enabled: boolean;

  content: VersionContent;

  updated_at?: string;
  created_at: string;

  article_language_id: number;
};

export type Language = {
  id: number;
  code: string;
};

export type ArticleType = 'Private' | 'Public' | 'Protected' | 'Restricted';
