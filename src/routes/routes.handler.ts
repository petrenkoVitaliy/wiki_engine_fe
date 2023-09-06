export const ROUTES = {
  main: () => '/',
  login: () => '/login',
  createArticle: () => '/create',
  createLanguage: (articleId: string | number) => `/create/${articleId}`,
  articleLanguage: (language: string | number, articleId: string | number) =>
    `/${articleId}/${language}`,
};

export class RoutesHandler {
  static withQuery(urn: string, query: { [key: string]: string }) {
    return `${urn}?${new URLSearchParams(query).toString()}`;
  }
}
