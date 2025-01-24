// Route: /
import type { Metadata } from 'next';
import styles from './page.module.css';
import { SignIn } from '../components/auth/SignIn';
import { SignUp } from '../components/auth/SignUp';
import { errors } from 'crypto-dashboard-shared';

export const metadata: Metadata = {
  title: 'Home - CryptoDashboard',
  description: 'Generated by lmd',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function Home() {
  const error = errors.users.incorrectPasswordFormat;
  console.log('error', error);

  return (
    <div className={styles.main}>
      <h1>Home page</h1>
      <div className={styles.authMenu}>
        <SignIn />
        <SignUp />
      </div>
    </div>
  );
}
