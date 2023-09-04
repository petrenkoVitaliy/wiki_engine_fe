import { ArticleDto, ArticleVersionDto } from '../dto/article.dto';
import { LoginDto, UserDto } from '../dto/auth.dto';
import { FetchHandler } from './fetch.handler';

class ApiHandler extends FetchHandler {
  public async login(credentials: { password: string; email: string }) {
    const loginResponse = await this.fetchApi<LoginDto>('auth/login', {
      method: 'post',
      cache: 'no-store',
      body: JSON.stringify(credentials),
    });

    return loginResponse;
  }

  public async getUser(authToken?: string) {
    const userResponse = await this.fetchApi<UserDto>(
      'auth/user',
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

  public async getArticle(id: string) {
    const articleResponse = await this.fetchApi<ArticleDto>(`articles/${id}`, {
      method: 'get',
      cache: 'no-store',
    });

    return articleResponse;
  }

  public async createArticleVersion(
    id: number,
    language: string,
    contentBody: { content: string }
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
}

const apiHandler = new ApiHandler();

export { apiHandler };
