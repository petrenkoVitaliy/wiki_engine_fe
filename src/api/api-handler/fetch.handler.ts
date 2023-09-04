import { CookieHandler } from '@/cookie/cookie.handler';
import { VerboseResponse } from '../types/request';

const ERROR_MESSAGES: { [key: number]: string } = {
  404: 'Cannot found requested information',
  400: 'Incorrect request',
  406: 'Incorrect information',
  401: 'User unauthorized',
  403: 'Insufficient permissions',
  500: 'Something went wrong',
  418: 'Something went very wrong',
};

class FetchHandler {
  private SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

  private getErrorMessage(res: Response) {
    return ERROR_MESSAGES[res.status] || ERROR_MESSAGES[500];
  }

  protected async fetchApi<T>(
    urn: string,
    fetchOptions: RequestInit,
    options?: { isAuth?: boolean; authToken?: string }
  ): Promise<VerboseResponse<T>> {
    const headers: { [key: string]: string } = {};

    if (options?.isAuth) {
      const authToken = options.authToken || CookieHandler.getAuthCookie();
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }
    }

    const res = await fetch(`${this.SERVER_URL}/${urn}`, { ...fetchOptions, headers });

    if (!res.ok) {
      return {
        status: 'error',
        message: this.getErrorMessage(res),
      };
    }

    const responseBody: T = await res.json();

    return {
      status: 'ok',
      result: responseBody,
    };
  }
}

export { FetchHandler };
