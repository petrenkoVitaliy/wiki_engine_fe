import { notFound } from 'next/navigation';

import { Navbar } from '@/containers/navbar/navbar';
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
  const [articleDto, versions, userDto] = await Promise.all([
    getArticleDto(params),
    getArticleVersionsDto(params),
    getUser(),
  ]);

  if (!articleDto) {
    notFound();
  }

  const article = ApiMapper.mapArticleDtoToType(articleDto);

  const selectedVersion = Number(searchParams?.['version'] as string) || null;

  return (
    <ArticleVersionContext.Provider
      value={{ article, versions, selectedVersion, language: params.language }}
    >
      <Navbar user={userDto?.user || null} />
      <ArticleHistory />
    </ArticleVersionContext.Provider>
  );
}

async function getArticleDto(params: ArticleLanguageParams) {
  const articleResponse = await apiHandler.getArticleByKey(params.article);

  if (articleResponse.status === 'error') {
    return null;
  }

  return articleResponse.result;
}

async function getArticleVersionsDto(params: ArticleLanguageParams) {
  const articleVersions = await apiHandler.getArticleVersionsByKey(params.article);

  if (articleVersions.status === 'error') {
    return [];
  }

  return articleVersions.result;
}

async function getUser() {
  const user = await AuthHandler.getUser({ isServerSide: true });

  return user;
}

// export async function generateStaticParams() { TODO tmp
//   const articlesListResponse = await apiHandler.getArticlesList();

//   const params: ArticleLanguageParams[] = [];

//   if (articlesListResponse.status === 'error') {
//     return params;
//   }

//   articlesListResponse.result.forEach((article) => {
//     article.languages.forEach((articleLanguage) => {
//       if (!articleLanguage.name_key.includes('main')) {
//         // TODO
//         params.push({
//           article: articleLanguage.name_key,
//           language: articleLanguage.language.code,
//         });
//       }
//     });
//   });

//   return params;
// }

export const dynamicParams = true;
