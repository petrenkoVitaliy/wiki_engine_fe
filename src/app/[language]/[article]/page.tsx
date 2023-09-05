import { notFound } from 'next/navigation';

import { Navbar } from '@/containers/navbar/navbar';
import { Footer } from '@/containers/footer/footer';
import { Article } from '@/containers/article-content/article';

import { apiHandler } from '@/api/api-handler/api.handler';
import { ApiMapper } from '@/api/api.mapper';

import { AuthHandler } from '@/auth/auth.handler';
import { ArticleContext } from '@/context/article-context';

import styles from './article-page.module.scss';

type ArticleLanguageProps = {
  params: ArticleLanguageParams;
};

type ArticleLanguageParams = {
  article: string;
  language: string;
};

export default async function ArticleLanguage(props: ArticleLanguageProps) {
  const [articleDto, user] = await Promise.all([getArticleDto(props.params), getUser()]);

  if (!articleDto) {
    notFound();
    return null;
  }

  const article = ApiMapper.mapArticleDtoToType(articleDto, props.params.language);

  return (
    <ArticleContext.Provider value={{ article, languages: [] }}>
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

  console.log(params);
  return params;
}
