import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Toaster } from '@/components/ui/toaster';
import Layout from '@/components/core/Layout';
import Provider from '@/components/providers/SessionProvider';
import type { Metadata } from 'next';
import { getServerSession } from 'next-auth/next';
import { Inter } from 'next/font/google';
import './globals.css';
import TanstackProvider from '@/components/providers/TanstackProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <html lang="en">
        <body className={`${inter.className} h-screen flex`}>
          <Provider session={session}>
            <TanstackProvider>{children}</TanstackProvider>
          </Provider>
          <Toaster />
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body className={`${inter.className} h-screen flex`}>
        <Provider session={session}>
          <TanstackProvider>
            <Layout>{children}</Layout>
          </TanstackProvider>
        </Provider>
        <Toaster />
      </body>
    </html>
  );
}
