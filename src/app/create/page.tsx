import { redirect } from 'next/navigation';

import { Navbar } from '@/containers/navbar/navbar';
import { ArticleSection } from '@/containers/article-section/article-section';

import { AuthHandler } from '@/auth/auth.handler';
import { ROUTES, RoutesHandler } from '@/routes/routes.handler';
import { ArticleContext, ArticleEditMode } from '@/context/article-context';
import { apiHandler } from '@/api/api-handler/api.handler';

export default async function CreateArticle() {
  const [userDto, languages] = await Promise.all([getUser(), getLanguages()]);

  if (!userDto) {
    redirect(RoutesHandler.withQuery(ROUTES.login(), { from: ROUTES.createArticle() }));
  }

  return (
    <ArticleContext.Provider value={{ article: null, languages, mode: ArticleEditMode.Creation }}>
      <Navbar user={userDto.user} />
      <ArticleSection isCreation />
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
