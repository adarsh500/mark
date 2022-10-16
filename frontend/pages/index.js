/* eslint-disable react-hooks/exhaustive-deps */
import clientPromise from 'lib/clientPromise';
import React, { useState, useEffect } from 'react';
import styles from '../styles/Home.module.scss';
import { useSession, signIn, signOut } from 'next-auth/react';
import Card from '@components/Card';
import { getSession } from 'next-auth/react';
import { HiOutlineSearch } from 'react-icons/hi';
import { Input, Popover, Text, Button } from '@nextui-org/react';
import { useIsTyping } from 'use-is-typing';

export default function Home(props) {
  const [isTyping, register] = useIsTyping();
  const { cards } = props;
  const { data: session } = useSession({ required: true });
  const [collections, setCollections] = useState([]);
  const [input, setInput] = useState('');
  const [tags, setTags] = useState([]);
  const [collection, setCollection] = useState('');
  const [query, setQuery] = useState('');
  const [visible, setVisible] = React.useState(false);
  const [searchData, setSearchData] = useState();

  console.log(isTyping);

  const getCollection = async () => {
    try {
      const res = await fetch(`api/collections/${session?.user?.email}`);
      const data = await res.json();
      setCollections(data);
    } catch (e) {
      console.log(e);
    }
  };
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

  const filter = () => {
    // set;
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
            // ref={register}
            fullWidth
            size="xl"
            placeholder="Search query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {/* <Button onClick={filter(cards)} auto>
            Search
          </Button> */}
        </div>
        <Popover isBordered disableShadow>
          <Popover.Trigger>
            <Button auto flat color="">
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
          {cards
            ?.filter((card) => {
              const delimiter = query.indexOf('-');
              const token = query.slice(0, delimiter);
              const value = query.slice(delimiter + 1);

              if (
                isTyping ||
                token === '' ||
                delimiter === -1 ||
                value.length < 4
              ) {
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
