import { notFound } from 'next/navigation';

import { Navbar } from '@/containers/navbar/navbar';
import { ArticleSection } from '@/containers/article-section/article-section';

import { apiHandler } from '@/api/api-handler/api.handler';
import { ApiMapper } from '@/mappers/api.mapper';
import { AuthHandler } from '@/auth/auth.handler';
import { ArticleContext, ArticleEditMode } from '@/context/article-context';

type ArticleLanguageCreationProps = {
  params: ArticleLanguageCreationParams;
};

type ArticleLanguageCreationParams = {
  article: string;
};

export default async function ArticleLanguageCreation({ params }: ArticleLanguageCreationProps) {
  const [articleDto, userDto, languages] = await Promise.all([
    getArticleDto(params),
    getUser(),
    getLanguages(),
  ]);

  if (!articleDto) {
    notFound();
  }

  const article = ApiMapper.mapArticleDtoToType(articleDto);

  return (
    <ArticleContext.Provider value={{ article, languages, mode: ArticleEditMode.LanguageCreation }}>
      <Navbar user={userDto?.user || null} />
      <ArticleSection isCreation />
    </ArticleContext.Provider>
  );
}

async function getArticleDto(params: ArticleLanguageCreationParams) {
  const articleResponse = await apiHandler.getArticleByKey(params.article);

  if (articleResponse.status === 'error') {
    return null;
  }

  return articleResponse.result;
}

async function getUser() {
  const user = await AuthHandler.getUser({ isServerSide: true });

  return user;
}

async function getLanguages() {
  const languages = await apiHandler.getSystemLanguages();

  if (languages.status === 'error') {
    return [];
  }

  return languages.result;
}

export async function generateStaticParams() {
  const articlesListResponse = await apiHandler.getArticlesList();

  const params: ArticleLanguageCreationParams[] = [];

  if (articlesListResponse.status === 'error') {
    return params;
  }

  articlesListResponse.result.forEach((article) => {
    article.languages.forEach((articleLanguage) => {
      params.push({
        article: articleLanguage.name_key,
      });
    });
  });

  return params;
}
