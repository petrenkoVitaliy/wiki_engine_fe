import Cookie from 'js-cookie';
import { cookies } from 'next/dist/client/components/headers';

import { AUTH_COOKIE_AGE, COOKIES } from './consts';

class CookieHandler {
  public static getAuthCookie(options?: { isServerSide?: boolean }) {
    if (options?.isServerSide) {
      return cookies().get(COOKIES.AUTH)?.value;
    }

    return Cookie.get(COOKIES.AUTH);
  }

  public static setAuthCookie(value: string) {
    return Cookie.set(COOKIES.AUTH, value, { maxAge: String(AUTH_COOKIE_AGE) });
  }

  public static removeAuthCookie() {
    return Cookie.remove(COOKIES.AUTH);
  }
}

export { CookieHandler };
