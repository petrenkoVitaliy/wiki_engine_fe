import { redirect } from 'next/navigation';

import { Navbar } from '@/containers/navbar/navbar';
import { Footer } from '@/containers/footer/footer';
import { Article } from '@/containers/article-content/article';

import { AuthHandler } from '@/auth/auth.handler';
import { ROUTES, RoutesHandler } from '@/routes/routes.handler';
import { ArticleContext, ArticleEditMode } from '@/context/article-context';
import { apiHandler } from '@/api/api-handler/api.handler';

import styles from './create-article-page.module.scss';

export default async function CreateArticle() {
  const [user, languages] = await Promise.all([getUser(), getLanguages()]);

  if (!user) {
    redirect(RoutesHandler.withQuery(ROUTES.login(), { from: ROUTES.createArticle() }));
  }

  return (
    <ArticleContext.Provider value={{ article: null, languages, mode: ArticleEditMode.Creation }}>
      <main className={styles.mainWrapper}>
        <Navbar user={user} />
        <Article />
        <Footer />
      </main>
    </ArticleContext.Provider>
  );
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
