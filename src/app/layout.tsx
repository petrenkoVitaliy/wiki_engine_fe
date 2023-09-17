import { Roboto_Flex, Roboto_Mono } from 'next/font/google';
import type { Metadata } from 'next';
import { ToastContainer } from 'react-toastify';

import { Provider } from '@/redux/provider';

import styles from './layout.module.scss';
import '../styles/reset.scss';
import clsx from 'clsx';

export const metadata: Metadata = {
  title: 'Wikifella',
  description: 'Wikifella',
};

const robotoFont = Roboto_Flex({
  subsets: ['latin', 'cyrillic-ext'],
  variable: '--font-roboto-flex',
  display: 'swap',
});

const robotoMonoFont = Roboto_Mono({
  subsets: ['latin', 'cyrillic-ext'],
  variable: '--font-roboto-mono-flex',
  display: 'swap',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang='en'
      className={clsx({
        [robotoFont.variable]: true,
        [robotoMonoFont.variable]: true,
      })}
    >
      <body className={styles.body}>
        <main className={styles.main}>
          <Provider>{children}</Provider>
          <ToastContainer />
        </main>
      </body>
    </html>
  );
}
