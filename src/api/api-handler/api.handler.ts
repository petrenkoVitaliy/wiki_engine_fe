import { ArticleDto } from '../dto/article.dto';
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

  // TODO
  public async getArticlesList() {
    try {
      const articlesResponse = await fetch(`${this.SERVER_URL}/articles`, {
        method: 'get',
        cache: 'no-store',
      });

      const articles: ArticleDto[] = await articlesResponse.json();

      return articles;
    } catch (ex) {
      console.log(JSON.stringify(ex, null, 2));

      throw ex;
    }
  }

  public async getArticle(id: string) {
    try {
      const articleResponse = await fetch(`${this.SERVER_URL}/articles/${id}`, {
        method: 'get',
        cache: 'no-store',
      });

      const article: ArticleDto = await articleResponse.json();

      return article;
    } catch (ex) {
      console.log(JSON.stringify(ex, null, 2));

      throw ex;
    }
  }
}

const apiHandler = new ApiHandler();

export { apiHandler };
