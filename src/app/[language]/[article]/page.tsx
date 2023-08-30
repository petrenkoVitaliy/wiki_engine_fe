import { Navbar } from '@/containers/navbar/navbar';
import { Footer } from '@/containers/footer/footer';

import { Article } from './article-content/article';

import styles from './article-page.module.scss';

export default function ArticleLanguage() {
  return (
    <main className={styles.mainWrapper}>
      <Navbar />
      <Article />
      <Footer />
    </main>
  );
}

export function generateStaticParams() {
  return [{ article: '1', language: 'en' }];
}

export const dynamicParams = false;
