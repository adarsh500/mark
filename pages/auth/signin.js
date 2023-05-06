import React from 'react';
import { signIn } from 'next-auth/react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from 'pages/api/auth/[...nextauth]';

export default function SignIn({ providers }) {
  return (
    <div>
      <button
        onClick={() =>
          signIn('google', {
            callbackUrl: '/',
          })
        }
      >
        Sign in with google
      </button>
    </div>
  );
}

SignIn.getLayout = function getLayout(page) {
  return <>{page}</>;
};

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session) {
    return { redirect: { destination: '/', permanent: false } };
  }

  return {
    props: {},
  };
}
