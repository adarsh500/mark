import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import BookmarkContainer from '@/components/core/BookmarkContainer';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';

const Favourites = async (props) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/api/auth/signin');
  }

  return <BookmarkContainer session={session} favourite {...props} />;
};

export default Favourites;
