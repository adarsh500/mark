/* eslint-disable react-hooks/exhaustive-deps */
import clientPromise from 'lib/clientPromise';
import React, { useState, useEffect } from 'react';
import styles from '../styles/Home.module.scss';
import { useSession, signIn, signOut } from 'next-auth/react';
import Card from '@components/Card';
import { getSession } from 'next-auth/react';
import { HiOutlineSearch } from 'react-icons/hi';
import { Input, Popover, Text, Button } from '@nextui-org/react';

const obj = {
  tag: 'tags',
  title: 'title',
  description: 'description',
};

export default function Home(props) {
  const { data: session } = useSession({ required: true });
  const [collections, setCollections] = useState([]);
  const [input, setInput] = useState('');
  const [tags, setTags] = useState([]);
  const [collection, setCollection] = useState('');
  const [query, setQuery] = useState('');
  const [visible, setVisible] = React.useState(false);
  const handler = () => setVisible(true);

  const getCollection = async () => {
    try {
      const res = await fetch(`api/collections/${session?.user?.email}`);
      const data = await res.json();
      setCollections(data);
    } catch (e) {
      console.log(e);
    }
  };

  console.log(query);
  // console.log(collections);

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
      <main className={styles.main}>
        Not signed in <br />
        <button onClick={() => signIn()}>Sign in</button>
      </main>
    );
  }

  return (
    <>
      <div className={styles.subNav}>
        <div className={styles.search}>
          <HiOutlineSearch className={styles.right} />
          <Input
            // className={styles.input}
            fullWidth
            size="xl"
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <Popover isBordered disableShadow>
          <Popover.Trigger>
            <Button auto flat>
              info
            </Button>
          </Popover.Trigger>
          <Popover.Content>
            <Text css={{ p: '$6 ' }}>
              use {"'"}tag-{'{'}query{'}'}
              {"'"} to search by tag
            </Text>
            <Text css={{ p: '$6' }}>
              use {"'"}title-{'{'}query{'}'}
              {"'"} to search by title
            </Text>
            <Text css={{ p: '$6' }}>
              use {"'"}dsc-{'{'}query{'}'}
              {"'"} to search by description
            </Text>
          </Popover.Content>
        </Popover>
      </div>
      <main className={styles.main}>
        <div className={styles.cardWrapper}>
          {props?.cards
            ?.filter((card) => {
              const delimiter = query.indexOf('-');
              const token = query.slice(0, delimiter);
              const value = query.slice(delimiter + 1);
              console.log('token', obj[token]);
              console.log('value', value);

              if (value === '' || delimiter === -1) {
                return true;
              }

              if (token === 'tag') {
                if (card.tags.includes(value.toLowerCase())) {
                  // if (card.tags.includes(value)) {
                  return true;
                }
              } else if (token === 'title') {
                if (
                  card.title
                    .split(' ')
                    .map((item) => item.toLowerCase())
                    .includes(value.toLowerCase())
                ) {
                  // if (card.tags.includes(value)) {
                  return true;
                }
              } else if (token === 'dsc') {
                if (
                  card.description
                    .split(' ')
                    .map((item) => item.toLowerCase())
                    .includes(value.toLowerCase())
                ) {
                  // if (card.tags.includes(value)) {
                  return true;
                }
              }
            })
            .map((card) => {
              return <Card key={card.id} {...card} />;
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
      cards: {},
    },
  };
}
