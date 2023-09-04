import { Navbar } from '@/containers/navbar/navbar';
import { Footer } from '@/containers/footer/footer';

import styles from './create-article-page.module.scss';
import { AuthHandler } from '@/auth/auth.handler';
import { redirect } from 'next/navigation';
import { ROUTES, RoutesHandler } from '@/routes/routes.handler';
import { Article } from '@/containers/article-content/article';
import { apiHandler } from '@/api/api-handler/api.handler';
import { ArticleContext } from '@/context/article-context';

export default async function CreateArticle() {
  const [user, languages] = await Promise.all([getUser(), getLanguages()]);

  if (!user) {
    redirect(RoutesHandler.withQuery(ROUTES.login(), { from: ROUTES.create() }));
  }

  return (
    <ArticleContext.Provider value={{ article: null, languages }}>
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
