/* eslint-disable react-hooks/exhaustive-deps */
import Card from '@components/Card';
import CardLoader from '@components/CardLoader';
import { Button } from '@nextui-org/react';
import styles from '@styles/Home.module.scss';
import axios from 'axios';
import clientPromise from 'lib/clientPromise';
import { getSession, signIn, useSession } from 'next-auth/react';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useInfiniteQuery } from 'react-query';

export default function Home(props) {
  const { ref, inView } = useInView();

  const { cards } = props;
  const { data: session } = useSession({ required: true });
  const [collections, setCollections] = useState([]);
  const [query, setQuery] = useState('');
  const [visible, setVisible] = React.useState(false);
  const [isInitial, setIsInitial] = useState(true);
  const [page, setPage] = useState(0);

  const fetchBookmarks = async (param) => {
    console.log(param);
    const res = await axios.get(
      `api/bookmarks?email=${session?.user?.email}&page=${
        param?.pageParam ?? 0
      }&limit=${28}`
    );
    return res;
  };

  const {
    status,
    data,
    error,
    isLoading,
    isFetching,
    isFetchingNextPage,
    isFetchingPreviousPage,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
  } = useInfiniteQuery(
    [
      'bookmarks',
      {
        page,
      },
    ],
    fetchBookmarks,
    {
      enabled: !!session?.user?.email,
      refetechOnWindowFocus: false,
      onSuccess: (data) => {
        if (isInitial) {
          setIsInitial(false);
        }
        console.log('data', data);
      },
      getNextPageParam: (lastPage, pages) => {
        console.log('last page', lastPage.data.currentPage);
        return parseInt(lastPage?.data?.currentPage) + 1;
      },
    }
  );

  useEffect(() => {
    if (inView) {
      // setPage(page + 1);
      fetchNextPage();
    }
  }, [inView]);

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
        <div className={styles.cardWrapper} ref={ref}>
          {isLoading ? (
            <>
              <div className={styles.loaderBlock}>
                <CardLoader />
                <CardLoader />
                <CardLoader />
                <CardLoader />
              </div>
              <div className={styles.loaderBlock}>
                <CardLoader />
                <CardLoader />
                <CardLoader />
                <CardLoader />
              </div>
            </>
          ) : null}
          {data ? (
            data?.pages?.map((page) => {
              return Object.keys(page?.data)
                .filter((key) => key !== 'currentPage')
                .map((key) => {
                  return (
                    <Card key={page?.data[key]?._id} {...page?.data[key]} />
                  );
                });
            })
          ) : (
            <Skeleton />
          )}
          <div className="btn-container">
            <Button
              onClick={() => fetchNextPage()}
              ref={ref}
              disabled={!hasNextPage || isFetchingNextPage}
              className={styles.loadMore}
            >
              {isFetchingNextPage
                ? 'Loading more...'
                : hasNextPage
                ? 'Load Newer'
                : 'Nothing more to load'}
            </Button>
            {isFetchingNextPage ? (
              <div className={styles.loaderBlock}>
                <CardLoader />
                <CardLoader />
                <CardLoader />
                <CardLoader />
              </div>
            ) : null}
          </div>
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
