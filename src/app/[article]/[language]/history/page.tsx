import { notFound } from 'next/navigation';

import { Navbar } from '@/containers/navbar/navbar';
import { Footer } from '@/containers/footer/footer';
import { ArticleHistory } from '@/containers/article-history/article-history';

import { apiHandler } from '@/api/api-handler/api.handler';
import { ApiMapper } from '@/mappers/api.mapper';
import { AuthHandler } from '@/auth/auth.handler';
import { ArticleVersionContext } from '@/context/article-version-context';

type ArticleLanguageProps = {
  params: ArticleLanguageParams;
  searchParams?: { [key: string]: string | string[] | undefined };
};

type ArticleLanguageParams = {
  article: string;
  language: string;
};

export default async function ArticleLanguage({ params, searchParams }: ArticleLanguageProps) {
  const [articleDto, versions, user] = await Promise.all([
    getArticleDto(params),
    getArticleVersionsDto(params),
    getUser(),
  ]);

  if (!articleDto) {
    notFound();
  }

  const article = ApiMapper.mapArticleDtoToType(articleDto);

  const selectedVersion = Number(searchParams?.['version'] as string) || null; // TODO

  return (
    <ArticleVersionContext.Provider
      value={{ article, versions, selectedVersion, language: params.language }}
    >
      <Navbar user={user} />
      <ArticleHistory />
      <Footer />
    </ArticleVersionContext.Provider>
  );
}

async function getArticleDto(params: ArticleLanguageParams) {
  const articleResponse = await apiHandler.getArticle(params.article);

  if (articleResponse.status === 'error') {
    return null;
  }

  return articleResponse.result;
}

async function getArticleVersionsDto(params: ArticleLanguageParams) {
  const articleVersions = await apiHandler.getArticleVersions(params.article, params.language);

  if (articleVersions.status === 'error') {
    return [];
  }

  return articleVersions.result;
}

async function getUser() {
  const user = await AuthHandler.getUser({ isServerSide: true });

  return user;
}

export async function generateStaticParams() {
  const articlesListResponse = await apiHandler.getArticlesList();

  const params: ArticleLanguageParams[] = [];

  if (articlesListResponse.status === 'error') {
    return params;
  }

  articlesListResponse.result.forEach((article) => {
    article.languages.forEach((articleLanguage) => {
      params.push({
        article: String(article.id),
        language: articleLanguage.language.code,
      });
    });
  });

  return params;
}

export const dynamicParams = false;
