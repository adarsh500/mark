import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth/next';

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <>
      {session !== null ? (
        <h1 className="leading-loose text-[1rem] font-extrabold text-black">
          Hi {session?.user.name || ''}! id: {session?.user.id || ''}
        </h1>
      ) : (
        <a className="btn btn-primary" href="api/auth/signin">
          Sign in
        </a>
      )}
    </>
  );
}
