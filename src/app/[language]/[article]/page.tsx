import { Navbar } from '@/containers/navbar/navbar';
import { Footer } from '@/containers/footer/footer';

import { Article } from './article-content/article';

import { ArticleContext } from '../../../context/article-context';

import { apiHandler } from '@/api/api-handler/api.handler';
import { apiMapper } from '@/api/api.mapper';

import styles from './article-page.module.scss';
import { AuthHandler } from '@/auth/auth.handler';

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
    return null; // TODO redirect to 404
  }

  const article = apiMapper.mapArticleDtoToType(articleDto, props.params.language);

  return (
    <ArticleContext.Provider value={{ article }}>
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

export const dynamicParams = false;
