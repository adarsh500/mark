import clientPromise from 'lib/clientPromise';
import React, { useState } from 'react';
import styles from '@styles/Home.module.scss';
import { useRouter } from 'next/router';
import { useSession, getSession } from 'next-auth/react';
import Card from '@components/Card';
import { HiOutlineSearch } from 'react-icons/hi';
import { Input } from '@nextui-org/react';

const Collection = (props) => {
  const { cards } = props;
  const { data: session } = useSession({ required: true });
  const [query, setQuery] = useState('');
  const router = useRouter();
  const { collection } = router.query;

  return (
    <>
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

export default Collection;

export async function getServerSideProps(context) {
  const { req } = context;
  const session = await getSession({ req });
  const client = await clientPromise;
  const db = client.db('test');
  // console.log('req', context.params.collection);

  if (session) {
    const coll = await db
      .collection('bookmarks')
      .find({
        email: session.user.email,
        collection: context.params.collection,
      })
      .toArray();

    console.log(coll);

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
