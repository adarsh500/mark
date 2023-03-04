import clientPromise from 'lib/clientPromise';
import Head from 'next/head';
import React, { useState, useEffect } from 'react';
import styles from '@styles/Home.module.scss';
import Card from '@components/Card';
import { HiOutlineSearch } from 'react-icons/hi';
import { Input } from '@nextui-org/react';

import { useSession, getSession } from 'next-auth/react';

const Favourites = (props) => {
  const { cards } = props;
  const { data: session } = useSession({ required: true });
  const [query, setQuery] = useState('');

  return (
    <>
      <Head>
        <title>Mark3</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className={styles.subNav}>
        <div className={styles.search}>
          <HiOutlineSearch className={styles.right} />
          <Input
            size="xl"
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>
      <main className={styles.main}>
        <div className={styles.cardWrapper}>
          {cards?.map((card) => (
            <Card key={card.id} {...card} />
          ))}
        </div>
      </main>
    </>
  );
};

export default Favourites;

export async function getServerSideProps(context) {
  const { req } = context;
  const session = await getSession({ req });
  const client = await clientPromise;
  const db = client.db('test');

  if (session) {
    const coll = await db
      .collection('bookmarks')
      .find({
        email: session.user.email,
        favourite: true,
      })
      .toArray();

    return {
      props: {
        cards: JSON.parse(JSON.stringify(coll)),
      },
    };
  }

  return {
    props: {
      cards: [],
    },
  };
}
