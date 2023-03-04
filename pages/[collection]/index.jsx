import Card from '@components/Card';
import styles from '@styles/Home.module.scss';
import clientPromise from 'lib/clientPromise';
import { getSession, useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';

const Collection = (props) => {
  const { cards } = props;
  const { data: session } = useSession({ required: true });
  const [query, setQuery] = useState('');
  const router = useRouter();
  const { collection } = router.query;

  return (
    <>
      <Head>
        <title>Mark3</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

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
