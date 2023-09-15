import { Roboto_Flex } from 'next/font/google';
import type { Metadata } from 'next';
import { ToastContainer } from 'react-toastify';

import { Provider } from '@/redux/provider';

import styles from './layout.module.scss';
import '../styles/reset.scss';

export const metadata: Metadata = {
  title: 'Wikifella',
  description: 'Wikifella',
};

const font = Roboto_Flex({
  subsets: ['latin'],
  variable: '--font-roboto-flex',
  display: 'swap',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' className={font.variable}>
      <body className={styles.body}>
        <main className={styles.main}>
          <Provider>{children}</Provider>
          <ToastContainer />
        </main>
      </body>
    </html>
  );
}
