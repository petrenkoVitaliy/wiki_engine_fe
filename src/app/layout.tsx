import type { Metadata } from 'next';
import { ToastContainer } from 'react-toastify';

import { Provider } from '@/redux/provider';

import styles from './layout.module.scss';
import '../styles/reset.scss';

export const metadata: Metadata = {
  title: 'Wikifella',
  description: 'Wikifella',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className={styles.body}>
        <main className={styles.main}>
          <Provider>{children}</Provider>
          <ToastContainer />
        </main>
      </body>
    </html>
  );
}
