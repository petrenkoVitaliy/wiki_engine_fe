import { apiHandler } from '@/api/api-handler/api.handler';
import { CookieHandler } from '@/cookie/cookie.handler';

class AuthHandler {
  public static async login(credentials: { password: string; email: string }) {
    const loginResponse = await apiHandler.login(credentials);

    if (loginResponse.status === 'ok') {
      CookieHandler.setAuthCookie(loginResponse.result.token.token);
    }

    return loginResponse;
  }

  public static async getUser(options?: { isServerSide?: boolean; article?: string }) {
    const authToken = CookieHandler.getAuthCookie(options);

    if (!authToken) {
      return null;
    }

    const userResponse = await apiHandler.getUser(authToken, options?.article);

    if (userResponse.status === 'error') {
      CookieHandler.removeAuthCookie();

      return null;
    }

    return userResponse.result;
  }
}

export { AuthHandler };
