import React from 'react';
import { ReactQueryDevtools } from 'react-query/devtools';
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

  const getLayout = Component.getLayout || ((page) => page);

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
                {getLayout(<Component {...pageProps} />)}
              </IconContext.Provider>
            </NextUIProvider>
          </NextThemesProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </Hydrate>
      </QueryClientProvider>
    </SessionProvider>
  );
}
