export const ROUTES = {
  main: () => '/',
  login: () => '/login',
  createArticle: () => '/create',
  createLanguage: (articleId: number) => `/create/${articleId}`,
  articleLanguage: (language: string, articleId: number) => `/${articleId}/${language}`,
};

export class RoutesHandler {
  static withQuery(urn: string, query: { [key: string]: string }) {
    return `${urn}?${new URLSearchParams(query).toString()}`;
  }
}
