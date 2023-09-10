import { notFound } from 'next/navigation';

import { Navbar } from '@/containers/navbar/navbar';
import { Footer } from '@/containers/footer/footer';

import { apiHandler } from '@/api/api-handler/api.handler';

import { ApiMapper } from '@/mappers/api.mapper';
import { AuthHandler } from '@/auth/auth.handler';
import { ArticleContext, ArticleEditMode } from '@/context/article-context';

type ArticleLanguageProps = {
  params: ArticleLanguageParams;
};

type ArticleLanguageParams = {
  article: string;
};

export default async function ArticleLanguage(props: ArticleLanguageProps) {
  const [articleDto, userDto] = await Promise.all([getArticleDto(props.params), getUser()]);

  if (!articleDto) {
    notFound();
  }

  const article = ApiMapper.mapArticleDtoToType(articleDto);

  return (
    <ArticleContext.Provider value={{ article, languages: [], mode: ArticleEditMode.Edit }}>
      <Navbar user={userDto?.user || null} />
      <section>History</section>
      <Footer />
    </ArticleContext.Provider>
  );
}

async function getArticleDto(params: ArticleLanguageParams) {
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

export async function generateStaticParams() {
  const articlesListResponse = await apiHandler.getArticlesList();

  const params: ArticleLanguageParams[] = [];

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
