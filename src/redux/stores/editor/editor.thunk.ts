import { ApiMapper } from '@/mappers/api.mapper';
import { ImageMapper } from '@/mappers/image.mapper';

import { apiHandler } from '@/api/api-handler/api.handler';
import { Article, ArticleType } from '@/api/types/article.types';

import { CustomElement } from '@/containers/wysiwyg/types';

import { setEditMode, sliceName } from './editor.slice';
import { createHandledAsyncThunk } from '../../thunk';

const CHUNK_SIZE = 9_437_184; // 9Mb

const uploadImagesWithContentUpdate = async (elements: CustomElement[]) => {
  const { imagesToCreate, imagesToCreateMap, elementsCopy } =
    ImageMapper.getImagesToCreate(elements);

  if (!imagesToCreate.length) {
    return JSON.stringify(elementsCopy);
  }

  const imagesChunksResponses = await Promise.all(
    ImageMapper.splitOnChunks(imagesToCreate, CHUNK_SIZE).map((chunk) =>
      apiHandler.createImages(chunk)
    )
  );

  const createdImagesResponse = ImageMapper.composeChunks(imagesChunksResponses);

  if (createdImagesResponse === null) {
    return null;
  }

  const content = ImageMapper.updateImageElements(
    createdImagesResponse,
    imagesToCreateMap,
    elementsCopy
  );

  return content;
};

export const createArticleLanguage = createHandledAsyncThunk(
  `${sliceName}/createArticleLanguage`,
  async (params: {
    elements: CustomElement[];
    id: number;
    language: string;
    name: string;
    storedArticle: Article;
    callback: (article: Article | null, language: string) => void;
  }) => {
    const { name, elements, language, callback, id, storedArticle } = params;

    const content = await uploadImagesWithContentUpdate(elements);

    if (content === null) {
      callback(null, language);

      return null;
    }

    const articleLanguageResponse = await apiHandler.createArticleLanguage(id, language, {
      content,
      name,
    });

    let article: Article | null = null;

    if (articleLanguageResponse.status === 'ok') {
      article = ApiMapper.addLanguageToArticle(storedArticle, articleLanguageResponse.result);
    }

    callback(article, language);

    return article;
  }
);

export const updateArticleType = createHandledAsyncThunk(
  `${sliceName}/updateArticleType`,
  async (params: {
    articleType: ArticleType;
    storedArticle: Article;
    callback: (article: Article | null) => void;
  }) => {
    const { articleType, storedArticle, callback } = params;

    const articleResponse = await apiHandler.updateArticle(storedArticle.id, {
      article_type: articleType,
    });

    let article: Article | null = null;

    if (articleResponse.status === 'ok') {
      article = {
        ...storedArticle,
        article_type: articleResponse.result.article_type,
      };
    }

    callback(article);

    return article;
  }
);

export const createArticle = createHandledAsyncThunk(
  `${sliceName}/createArticle`,
  async (params: {
    elements: CustomElement[];
    language: string;
    name: string;
    callback: (article: Article | null, language: string) => void;
  }) => {
    const { elements, name, language, callback } = params;

    const content = await uploadImagesWithContentUpdate(elements);

    if (content === null) {
      callback(null, language);

      return null;
    }

    const articleResponse = await apiHandler.createArticle({
      content,
      language,
      name,
      article_type: ArticleType.Public,
    });

    let article: Article | null = null;

    if (articleResponse.status === 'ok') {
      article = ApiMapper.mapArticleDtoToType(articleResponse.result);
    }

    callback(article, language);

    return article;
  }
);

export const editArticle = createHandledAsyncThunk(
  `${sliceName}/editArticle`,
  async (
    params: {
      elements: CustomElement[];
      id: number;
      language: string;
      storedArticle: Article;
      callback: (article: Article | null) => void;
      name?: string;
    },
    thunkApi
  ) => {
    thunkApi.dispatch(setEditMode(false));

    const { elements, id, language, storedArticle, callback, name } = params;

    const content = await uploadImagesWithContentUpdate(elements);

    if (content === null) {
      callback(null);

      return null;
    }

    const articleVersionResponse = await apiHandler.createArticleVersion(id, language, {
      content,
      name,
    });

    let article: Article | null = null;

    if (articleVersionResponse.status === 'ok') {
      const updatedLanguagesMap = { ...storedArticle.languagesMap };

      const updatedArticleLanguages = storedArticle.languages.map((articleLanguage) => {
        if (articleLanguage.language.code !== language) {
          return articleLanguage;
        }

        const name_key = articleVersionResponse.result.name.toLowerCase().replaceAll(' ', '_');

        const updatedArticleLanguage = {
          ...updatedLanguagesMap[language],
          name_key,
          name: articleVersionResponse.result.name,
          version: articleVersionResponse.result,
        };

        updatedLanguagesMap[language] = updatedArticleLanguage;

        return updatedArticleLanguage;
      });

      article = {
        ...storedArticle,
        languages: updatedArticleLanguages,
        languagesMap: updatedLanguagesMap,
      };
    }

    callback(article);

    return article;
  }
);
