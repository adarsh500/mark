import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.scss';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Home() {
  const { data: session } = useSession({required: true});
  console.log(session);

  if (!session) {
    return (
      <>
        Not signed in <br />
        <button onClick={() => signIn()}>Sign in</button>
      </>
    );
  }

  return (
    <main className={styles.main}>
      Signed in as {session.user.email} <br />
      <button onClick={() => signOut()}>Sign out</button>
    </main>
  );
}
