import { notFound } from 'next/navigation';

import { apiHandler } from '@/api/api-handler/api.handler';
import { AuthHandler } from '@/auth/auth.handler';

import { Navbar } from '@/containers/navbar/navbar';
import { Preview } from '@/containers/preview/preview';

import { ApiMapper } from '@/mappers/api.mapper';

const MAIN_ARTICLE_NAME_KEY = 'main';

type MainPageProps = {
  params: MainPageParams;
};

type MainPageParams = {
  language: string;
};

export default async function MainPage({ params }: MainPageProps) {
  const [articleDto, userDto] = await Promise.all([getArticleDto(), getUser()]);

  if (!articleDto) {
    notFound();
  }

  const article = ApiMapper.mapArticleDtoToType(articleDto);

  return (
    <>
      <Navbar user={userDto?.user || null} />
      <Preview article={article} language={params.language} />
    </>
  );
}

async function getArticleDto() {
  const articleResponse = await apiHandler.getArticleByKey(MAIN_ARTICLE_NAME_KEY);

  if (articleResponse.status === 'error') {
    return null;
  }

  return articleResponse.result;
}

async function getUser() {
  const user = await AuthHandler.getUser({ isServerSide: true });

  return user;
}

export async function generateStaticParams() {
  const articleResponse = await apiHandler.getArticleByKey(MAIN_ARTICLE_NAME_KEY);

  const params: MainPageParams[] = [];

  if (articleResponse.status === 'error') {
    return params;
  }

  articleResponse.result.languages.forEach((articleLanguage) => {
    params.push({ language: articleLanguage.language.code });
  });

  return params;
}

export const dynamicParams = false;
