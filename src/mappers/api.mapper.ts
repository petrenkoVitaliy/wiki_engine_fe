import { pickAndExtend } from '@/utils/utils';

import { ArticleDto, ArticleLanguageDto, LanguageDto } from '../api/dto/article.dto';
import { Article, ArticleLanguage } from '../api/types/article.types';

class ApiMapper {
  public static mapArticleDtoToType(articleDto: ArticleDto): Article {
    const languagesMap = articleDto.languages.reduce<{ [key: string]: ArticleLanguage }>(
      (acc, articleLanguage) => {
        acc[articleLanguage.language.code] = articleLanguage;

        return acc;
      },
      {}
    );

    return {
      languagesMap,

      id: articleDto.id,
      enabled: articleDto.enabled,
      archived: articleDto.archived,
      article_type: articleDto.article_type,
      updated_at: articleDto.updated_at,
      created_at: articleDto.created_at,
      languages: articleDto.languages,
    };
  }

  public static getLanguageOptionsFromArticle(article: Article): {
    label: string;
    value: string;
  }[] {
    const languageOptions =
      article.languages.map(({ language: { code } }) => ({
        value: code,
        label: code,
      })) || [];

    return languageOptions;
  }

  public static addLanguageToArticle(
    article: Article,
    newArticleLanguage: ArticleLanguageDto
  ): Article {
    const languages = [...article.languages];
    languages.push(newArticleLanguage);

    const languagesMap = { ...article.languagesMap };
    languagesMap[newArticleLanguage.language.code] = newArticleLanguage;

    return pickAndExtend(
      article,
      ['id', 'enabled', 'archived', 'article_type', 'updated_at', 'created_at'],
      {
        languages,
        languagesMap,
      }
    );
  }

  public static getAvailableLanguages(
    articleDto: ArticleDto,
    languages: LanguageDto[]
  ): LanguageDto[] {
    const usedLanguagesMap = articleDto.languages.reduce<{ [key: string]: boolean }>(
      (acc, articleLanguage) => {
        acc[articleLanguage.language.code] = true;

        return acc;
      },
      {}
    );

    return languages.filter((language) => !usedLanguagesMap[language.code]);
  }
}

export { ApiMapper };
