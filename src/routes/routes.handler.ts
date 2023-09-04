export const ROUTES = {
  main: () => '/',
  login: () => 'login',
  articleLanguage: (language: string, articleId: number) => `/${language}/${articleId}`,
};

export class RoutesHandler {
  static withQuery(urn: string, query: { [key: string]: string }) {
    return `/${urn}?${new URLSearchParams(query).toString()}`;
  }
}
