'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from '../core/ThemeProvider';
import TanstackProvider from './TanstackProvider';

export default function Provider({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any;
}): React.ReactNode {
  return (
    <SessionProvider session={session}>
      <TanstackProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </TanstackProvider>
    </SessionProvider>
  );
}
