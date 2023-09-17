const DEFAULT_LANGUAGE = 'en';

export const ROUTES = {
  main: (articleLanguageKey?: string) => `/main/${articleLanguageKey || DEFAULT_LANGUAGE}`,
  login: () => '/login',
  signup: () => '/signup',
  createArticle: () => '/create',

  createLanguage: (articleLanguageKey: string) => `/create/${articleLanguageKey}`,

  articleLanguageHistory: (articleLanguageKey: string, language: string | number) =>
    `/${articleLanguageKey}/${language}/history`,

  articleLanguage: (articleLanguageKey: string, language: string | number) =>
    `/${articleLanguageKey}/${language}`,
};

export class RoutesHandler {
  static withQuery(urn: string, query: { [key: string]: string }) {
    return `${urn}?${new URLSearchParams(query).toString()}`;
  }
}
