import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.scss';
import { useSession, signIn, signOut } from 'next-auth/react';
import Navbar from '@components/Navbar';
import mql from '@microlink/mql';
import Card from '@components/Card';
// import { getMetaData } from 'metadata-scraper';

const cards = [
  {
    id: 1,
    image:
      'https://www.freecodecamp.org/news/content/images/2021/03/discordjs.png',
    title: 'Anurag Hazra - Creative Web Designer',
    description:
      'Anurag Hazra - Creative frontEnd web developer who loves javascript and modern web technologies',
    url: 'anuraghazra.github.io',
    date: 'Apr 2, 2021',
  },
  {
    id: 2,
    image: 'https://picsum.photos/seed/picsum/200/300',
    title: 'Anurag Hazra - Creative Web Designer',
    description:
      'Anurag Hazra - Creative frontEnd web developer who loves javascript and modern web technologies',
    url: 'anuraghazra.github.io',
    date: 'Apr 2, 2021',
  },
  {
    id: 3,
    image: 'https://picsum.photos/id/237/400/300',
    title: 'Anurag Hazra - Creative Web Designer',
    description:
      'Anurag Hazra - Creative frontEnd web developer who loves javascript and modern web technologies',
    url: 'anuraghazra.github.io',
    date: 'Apr 2, 2021',
  },
  {
    id: 4,
    image: 'https://picsum.photos/id/1/200/300',
    title: 'Anurag Hazra - Creative Web Designer',
    description:
      'Anurag Hazra - Creative frontEnd web developer who loves javascript and modern web technologies',
    url: 'anuraghazra.github.io',
    date: 'Apr 2, 2021',
  },
  {
    id: 5,
    image: 'https://picsum.photos/id/217/400/300',
    title: 'Anurag Hazra - Creative Web Designer',
    description:
      'Anurag Hazra - Creative frontEnd web developer who loves javascript and modern web technologies',
    url: 'anuraghazra.github.io',
    date: 'Apr 2, 2021',
  },
  {
    id: 6,
    image: 'https://picsum.photos/id/17/400/300',
    title: 'Anurag Hazra - Creative Web Designer',
    description:
      'Anurag Hazra - Creative frontEnd web developer who loves javascript and modern web technologies',
    url: 'anuraghazra.github.io',
    date: 'Apr 2, 2021',
  },
  {
    id: 7,
    image: 'https://picsum.photos/id/437/400/300',
    title: 'Anurag Hazra - Creative Web Designer',
    description:
      'Anurag Hazra - Creative frontEnd web developer who loves javascript and modern web technologies',
    url: 'anuraghazra.github.io',
    date: 'Apr 2, 2021',
  },
  {
    id: 8,
    image: 'https://picsum.photos/id/27/400/300',
    title: 'Anurag Hazra - Creative Web Designer',
    description:
      'Anurag Hazra - Creative frontEnd web developer who loves javascript and modern web technologies',
    url: 'anuraghazra.github.io',
    date: 'Apr 2, 2021',
  },
];

export default function Home() {
  const { data: session } = useSession({ required: true });
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
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.cardWrapper}>
          {cards.map((card) => (
            <Card key={card.id} {...card} />
          ))}
        </div>
      </main>
    </>
  );
}
