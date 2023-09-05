export const ROUTES = {
  main: () => '/',
  login: () => '/login',
  createArticle: () => '/create',
  addLanguage: (articleId: number) => `/${articleId}/add-language`,
  articleLanguage: (language: string, articleId: number) => `/${articleId}/${language}`,
};

export class RoutesHandler {
  static withQuery(urn: string, query: { [key: string]: string }) {
    return `${urn}?${new URLSearchParams(query).toString()}`;
  }
}
