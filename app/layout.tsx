import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Layout from '@/components/core/Layout';
import Provider from '@/components/providers/SessionProvider';
import { Toaster } from '@/components/ui/toaster';
import { GeistSans } from 'geist/font/sans';
import type { Metadata } from 'next';
import { getServerSession } from 'next-auth/next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mark',
  description: 'A bookmark manager for developers',
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
        <body className={`${GeistSans.className} h-screen flex`}>
          <Provider session={session}>{children}</Provider>
          <Toaster />
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body className={`${GeistSans.className} h-screen flex`}>
        <Provider session={session}>
          <Layout>{children}</Layout>
        </Provider>
        <Toaster />
      </body>
    </html>
  );
}
