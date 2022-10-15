import clientPromise from 'lib/clientPromise';
import React from 'react';
import styles from '@styles/Home.module.scss';
import { useRouter } from 'next/router';
import { useSession, getSession } from 'next-auth/react';
import Card from '@components/Card';

const Collection = (props) => {
  const { data: session } = useSession({ required: true });
  console.log(props);
  const router = useRouter();
  const { collection } = router.query;

  return (
    <main className={styles.main}>
      <div className={styles.cardWrapper}>
        {props?.cards?.map((card) => (
          <Card key={card.id} {...card} />
        ))}
      </div>
    </main>
  );
};

export default Collection;

export async function getServerSideProps(context) {
  const { req } = context;
  const session = await getSession({ req });
  const client = await clientPromise;
  const db = client.db('test');
  console.log('req', context.params.collection);

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
      cards: {},
    },
  };
}
