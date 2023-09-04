import { ArticleDto } from './dto/article.dto';
import { Article, ArticleLanguage } from './types/article.types';

// TODO
class ApiMapper {
  public mapArticleDtoToType(articleDto: ArticleDto, selectedLanguageCode: string): Article {
    let language: ArticleLanguage | undefined;

    const otherLanguages: string[] = articleDto.languages.reduce<string[]>(
      (acc, articleLanguage) => {
        if (articleLanguage.language.code !== selectedLanguageCode) {
          acc.push(articleLanguage.language.code);
        } else {
          language = articleLanguage;
        }

        return acc;
      },
      []
    );

    return {
      id: articleDto.id,
      enabled: articleDto.enabled,
      archived: articleDto.archived,
      article_type: articleDto.article_type,
      updated_at: articleDto.updated_at,
      created_at: articleDto.created_at,

      language: language || articleDto.languages[0],
      otherLanguages,
    };
  }

  public getLanguageOptionsFromArticle(article: Article): {
    label: string;
    value: string;
  }[] {
    const languageOptions =
      article.otherLanguages.map((languageCode) => ({
        value: languageCode,
        label: languageCode,
      })) || [];

    const selectedLanguage = article.language.language.code;

    languageOptions.push({
      label: selectedLanguage,
      value: selectedLanguage,
    });

    return languageOptions;
  }
}

const apiMapper = new ApiMapper();

export { apiMapper };
