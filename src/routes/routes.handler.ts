export const ROUTES = {
  main: () => '/',
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
