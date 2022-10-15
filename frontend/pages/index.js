/* eslint-disable react-hooks/exhaustive-deps */
import clientPromise from 'lib/clientPromise';
import React, { useState, useEffect } from 'react';
import styles from '../styles/Home.module.scss';
import { useSession, signIn, signOut } from 'next-auth/react';
import Navbar from '@components/Navbar';
import Card from '@components/Card';
import { getSession } from 'next-auth/react';

export default function Home(props) {
  console.log('home', props);
  const { data: session } = useSession({ required: true });
  const [collections, setCollections] = useState([]);
  const [input, setInput] = useState('');
  const [tags, setTags] = useState([]);
  const [collection, setCollection] = useState('');
  const [query, setQuery] = useState('');
  const [sortValue, setSortValue] = useState('id');
  const [cards, setCards] = useState([]);
  const [visible, setVisible] = React.useState(false);
  const handler = () => setVisible(true);
  console.log('cards', cards);
  console.log(tags);
  console.log(link);

  const getCollection = async () => {
    try {
      const res = await fetch(`api/collections/${session?.user?.email}`);
      const data = await res.json();
      setCollections(data);
    } catch (e) {
      console.log(e);
    }
  };

  console.log(collections);

  const createBookmark = async () => {
    const res = await fetch(`api/bookmarks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: session.user.email,
        collection: collection,
        tags: tags,
        url: `https://${link}`,
        favourite: false,
        tags: tags,
      }),
    });
    closeHandler();
  };

  useEffect(() => {
    getCollection();
  }, [visible]);

  const deleteTag = (index) => {
    setTags((prevState) => prevState.filter((tag, i) => i !== index));
  };

  const closeHandler = () => {
    setVisible(false);
  };

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
      <Navbar
        handler={handler}
        closeHandler={closeHandler}
        query={query}
        setQuery={setQuery}
      />
      <main className={styles.main}>
        <div className={styles.cardWrapper}>
          {props?.cards?.map((card) => (
            <Card key={card.id} {...card} />
          ))}
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
      cards: {},
    },
  };
}
