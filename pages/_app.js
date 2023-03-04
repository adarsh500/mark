import Layout from '@components/layout/Layout';
import { createTheme, NextUIProvider } from '@nextui-org/react';
import '@styles/globals.scss';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { useState } from 'react';
import { IconContext } from 'react-icons';
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query';

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
  const [queryClient] = useState(() => new QueryClient());

  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
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
        </Hydrate>
      </QueryClientProvider>
    </SessionProvider>
  );
}
