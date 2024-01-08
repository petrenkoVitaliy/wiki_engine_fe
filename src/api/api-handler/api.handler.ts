import { ImageToCreate } from '@/mappers/types';

import {
  ArticleDto,
  ArticleLanguageDto,
  ArticleVersionDto,
  ArticlesSearchDto,
  LanguageDto,
} from '../dto/article.dto';
import { LoginDto, UserWithPermissionsDto } from '../dto/auth.dto';
import { ResponseDto } from '../dto/response.dto';
import { ArticleType } from '../types/article.types';

import { InternalApiHandler } from './internal/internal-api.handler';
import { FetchHandler } from './fetch.handler';

class ApiHandler extends FetchHandler {
  public internalApi = new InternalApiHandler();

  public async login(credentials: { password: string; email: string }) {
    const loginResponse = await this.fetchApi<LoginDto>('auth/login', {
      method: 'post',
      cache: 'no-store',
      body: JSON.stringify(credentials),
    });

    return loginResponse;
  }

  public async getUser(authToken: string, article?: string) {
    const userResponse = await this.fetchApi<UserWithPermissionsDto>(
      `auth/user${article ? '?article_code=' + article : ''}`,
      {
        method: 'get',
        cache: 'no-store',
      },
      { isAuth: true, authToken }
    );

    return userResponse;
  }

  public async getArticlesList() {
    const articlesResponse = await this.fetchApi<ArticleDto[]>('articles', {
      method: 'get',
      cache: 'no-store',
    });

    return articlesResponse;
  }

  public async getArticlesListByQuery(query: string, { signal }: { signal: AbortSignal }) {
    const articlesResponse = await this.fetchApi<ArticlesSearchDto[]>(
      `articles/search?query=${query}`,
      {
        method: 'get',
        cache: 'no-store',
        signal,
      }
    );

    return articlesResponse;
  }

  public async getArticle(id: string) {
    const articleResponse = await this.fetchApi<ArticleDto>(`articles/${id}`, {
      method: 'get',
      cache: 'no-store',
    });

    return articleResponse;
  }

  public async getArticleByKey(key: string) {
    const articleResponse = await this.fetchApi<ArticleDto>(`articles/key/${key}`, {
      method: 'get',
      cache: 'no-store',
    });

    return articleResponse;
  }

  public async getArticleVersionsByKey(key: string) {
    const articleVersionsResponse = await this.fetchApi<ArticleVersionDto[]>(
      `articles/key/${key}/version`,
      {
        method: 'get',
        cache: 'no-store',
      }
    );

    return articleVersionsResponse;
  }

  public async getArticleVersions(id: string, language: string) {
    const articleVersionsResponse = await this.fetchApi<ArticleVersionDto[]>(
      `articles/${id}/language/${language}/version`,
      {
        method: 'get',
        cache: 'no-store',
      }
    );

    return articleVersionsResponse;
  }

  public async createArticleVersion(
    id: number,
    language: string,
    contentBody: { content: string; name?: string }
  ) {
    const articleResponse = await this.fetchApi<ArticleVersionDto>(
      `articles/${id}/language/${language}/version`,
      {
        method: 'post',
        cache: 'no-store',
        body: JSON.stringify(contentBody),
      },
      { isAuth: true }
    );

    return articleResponse;
  }

  public async createImages(contentBody: ImageToCreate[]) {
    const articleResponse = await this.fetchApi<{ id: number; uri: string }[]>(
      'image',
      {
        method: 'post',
        cache: 'no-store',
        body: JSON.stringify(contentBody),
      },
      { isAuth: true }
    );

    return articleResponse;
  }

  public async updateArticle(
    id: number,
    contentBody: {
      article_type: ArticleType;
    }
  ) {
    const articleResponse = await this.fetchApi<ArticleDto>(
      `articles/${id}`,
      {
        method: 'PATCH',
        cache: 'no-store',
        body: JSON.stringify(contentBody),
      },
      { isAuth: true }
    );

    return articleResponse;
  }

  public async createArticle(contentBody: {
    content: string;
    language: string;
    name: string;
    article_type: string;
  }) {
    const articleResponse = await this.fetchApi<ArticleDto>(
      'articles',
      {
        method: 'post',
        cache: 'no-store',
        body: JSON.stringify(contentBody),
      },
      { isAuth: true }
    );

    return articleResponse;
  }

  public async createArticleLanguage(
    id: number,
    language: string,
    contentBody: {
      content: string;
      name: string;
    }
  ) {
    const articleLanguageResponse = await this.fetchApi<ArticleLanguageDto>(
      `articles/${id}/language/${language}`,
      {
        method: 'post',
        cache: 'no-store',
        body: JSON.stringify(contentBody),
      },
      { isAuth: true }
    );

    return articleLanguageResponse;
  }

  public async getSystemLanguages() {
    const languagesResponse = await this.fetchApi<LanguageDto[]>('languages', {
      method: 'get',
      cache: 'no-store',
    });

    return languagesResponse;
  }

  public async signup(
    contentBody: { email: string; name: string; password: string },
    from: string | null
  ) {
    const languagesResponse = await this.fetchApi<ResponseDto>(
      `auth/signup${from ? '?redirect_to=' + from : ''}`,
      {
        method: 'post',
        cache: 'no-store',
        body: JSON.stringify(contentBody),
      }
    );

    return languagesResponse;
  }

  public async confirmUser(contentBody: { email: string; otp: string }) {
    const confirmResponse = await this.fetchApi<LoginDto>('auth/confirm', {
      method: 'post',
      cache: 'no-store',
      body: JSON.stringify(contentBody),
    });

    return confirmResponse;
  }
}

const apiHandler = new ApiHandler();

export { apiHandler };
