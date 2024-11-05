'use client';
import '../styles/globals.css';
import HeaderLayout from '../components/header/HeaderLayout';
import FooterLayout from '../components/footer/FooterLayout';
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import { Inter, Poppins } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-inter',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-poppins',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Provider store={store}>
        <body className={`${inter.variable} ${poppins.variable}`}>
          <HeaderLayout />
          <div className="container">{children}</div>
          <FooterLayout />
        </body>
      </Provider>
    </html>
  );
}
