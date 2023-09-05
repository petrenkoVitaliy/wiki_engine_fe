import { notFound } from 'next/navigation';

import { Navbar } from '@/containers/navbar/navbar';
import { Footer } from '@/containers/footer/footer';
import { Article } from '@/containers/article-content/article';

import { apiHandler } from '@/api/api-handler/api.handler';
import { ApiMapper } from '@/api/api.mapper';

import { AuthHandler } from '@/auth/auth.handler';
import { ArticleContext, ArticleEditMode } from '@/context/article-context';

import styles from './article-page.module.scss';

type ArticleLanguageProps = {
  params: ArticleLanguageParams;
};

type ArticleLanguageParams = {
  article: string;
};

export default async function ArticleLanguage(props: ArticleLanguageProps) {
  const [articleDto, user, languages] = await Promise.all([
    getArticleDto(props.params),
    getUser(),
    getLanguages(),
  ]);

  if (!articleDto) {
    notFound();
  }

  const article = ApiMapper.mapArticleDtoToType(articleDto);
  const availableLanguages = ApiMapper.getAvailableLanguages(articleDto, languages);

  return (
    <ArticleContext.Provider
      value={{ article, languages: availableLanguages, mode: ArticleEditMode.LanguageCreation }}
    >
      <main className={styles.mainWrapper}>
        <Navbar user={user} />
        <Article />
        <Footer />
      </main>
    </ArticleContext.Provider>
  );
}

async function getArticleDto(params: ArticleLanguageParams) {
  const articleResponse = await apiHandler.getArticle(params.article);

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

  const params: ArticleLanguageParams[] = [];

  if (articlesListResponse.status === 'error') {
    return params;
  }

  articlesListResponse.result.forEach((article) => {
    params.push({
      article: String(article.id),
    });
  });

  console.log(params);
  return params;
}

export const dynamicParams = false;
