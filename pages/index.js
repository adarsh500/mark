/* eslint-disable react-hooks/exhaustive-deps */
import Card from '@components/Card';
import styles from '@styles/Home.module.scss';
import clientPromise from 'lib/clientPromise';
import { getSession, signIn, useSession } from 'next-auth/react';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';

export default function Home(props) {
  const { cards } = props;
  const { data: session } = useSession({ required: true });
  const [collections, setCollections] = useState([]);
  const [query, setQuery] = useState('');
  const [visible, setVisible] = React.useState(false);

  const getCollection = async () => {
    try {
      const res = await fetch(`api/collections/${session?.user?.email}`);
      const data = await res.json();
      setCollections(data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getCollection();
  }, [visible]);

  const closeHandler = () => {
    setVisible(false);
  };

  if (!session) {
    return (
      <main className={styles.main}>
        Not signed in <br />
        <button onClick={() => signIn()}>Sign in</button>
      </main>
    );
  }

  return (
    <>
      <Head>
        <title>Mark3</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <main className={styles.main}>
        <div className={styles.cardWrapper}>
          {cards
            ?.filter((card) => {
              const delimiter = query.indexOf('-');
              const token = query.slice(0, delimiter);
              const value = query.slice(delimiter + 1);

              if (token === '' || delimiter === -1 || value.length < 4) {
                return card;
              }

              if (token === 'tag') {
                if (card.tags?.includes(value.toLowerCase())) {
                  // if (card.tags.includes(value)) {
                  return card;
                }
              } else if (token === 'title') {
                if (
                  card?.title
                    ?.split(' ')
                    ?.some(
                      (element) => element.toLowerCase() == value.toLowerCase()
                    )
                ) {
                  // if (card.tags.includes(value)) {
                  return card;
                }
              } else if (token === 'dsc') {
                if (
                  card?.description
                    ?.split(' ')
                    ?.some(
                      (element) => element.toLowerCase() == value.toLowerCase()
                    )
                ) {
                  // if (card.tags.includes(value)) {
                  return card;
                }
              }
            })
            ?.map((card) => {
              return <Card key={card._id} {...card} />;
            })}
        </div>
      </main>
    </>
  );
}

export async function getServerSideProps(context) {
  const { req } = context;
  const session = await getSession({ req });
  const client = await clientPromise;
  const db = client.db('test');

  if (session) {
    const coll = await db
      .collection('bookmarks')
      .find({ email: session.user.email })
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
