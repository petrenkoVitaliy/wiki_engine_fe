import type { Metadata } from 'next';
import { ToastContainer } from 'react-toastify';

import { Provider } from '@/redux/provider';

import styles from './layout.module.scss';
import '../styles/reset.scss';

export const metadata: Metadata = {
  title: 'Wiki engine',
  description: 'Wiki engine FE',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className={styles.body}>
        <Provider>{children}</Provider>
        <ToastContainer />
      </body>
    </html>
  );
}
