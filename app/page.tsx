import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import BookmarkContainer from '@/components/core/BookmarkContainer';
import Layout from '@/components/core/Layout';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';

export default async function Home(props) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/api/auth/signin');
  }

  return (
    <Layout>
      <BookmarkContainer session={session} {...props} />
    </Layout>
  );
}
