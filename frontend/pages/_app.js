import { SessionProvider } from 'next-auth/react';
import { IconContext } from 'react-icons';
import Layout from '../layout/Layout';
import { NextUIProvider, createTheme } from '@nextui-org/react';

import '../styles/globals.scss';

import { ThemeProvider as NextThemesProvider } from 'next-themes';

const lightTheme = createTheme({
  type: 'light',
  theme: {
    colors: {}, // optional
  },
});

const darkTheme = createTheme({
  type: 'dark',
  theme: {
    colors: {}, // optional
  },
});

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <NextThemesProvider
        defaultTheme="system"
        attribute="class"
        value={{
          light: lightTheme.className,
          dark: darkTheme.className,
        }}
      >
        <NextUIProvider>
          <IconContext.Provider value={{ className: 'icon' }}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </IconContext.Provider>
        </NextUIProvider>
      </NextThemesProvider>
    </SessionProvider>
  );
}
