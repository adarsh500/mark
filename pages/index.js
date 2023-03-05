/* eslint-disable react-hooks/exhaustive-deps */
import Card from '@components/Card';
import CardLoader from '@components/CardLoader';
import { Button } from '@nextui-org/react';
import styles from '@styles/Home.module.scss';
import { signIn, useSession } from 'next-auth/react';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useFetchBookmarks } from '../hooks/useFetchBookmarks';

export default function Home(props) {
  const { ref, inView } = useInView();
  const { data: session } = useSession({ required: true });
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);

  const {
    data,
    isLoading,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useFetchBookmarks({
    page,
    email: session?.user?.email,
    configs: [
      {
        enabled: !!session?.user?.email,
        refetechOnWindowFocus: false,
        getNextPageParam: (lastPage, page) => {
          return parseInt(lastPage?.data?.currentPage) + 1 ?? undefined;
        },
      },
    ],
  });

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

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
          {isLoading ? (
            <>
              <div className={styles.loaderBlock}>
                {[1, 2, 3, 4].map((item) => (
                  <CardLoader
                    style={{
                      width: 'calc(calc(100% - 96px) / 4)',
                    }}
                  />
                ))}
              </div>
              <div className={styles.loaderBlock}>
                {[1, 2, 3, 4].map((item) => (
                  <CardLoader
                    style={{
                      width: 'calc(calc(100% - 96px) / 4)',
                    }}
                  />
                ))}
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
            {hasNextPage ? (
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
            ) : null}

            {isFetchingNextPage ? (
              <div className={styles.loaderBlock}>
                {[1, 2, 3, 4].map((item) => (
                  <CardLoader
                    style={{
                      width: 'calc(calc(100% - 96px) / 4)',
                    }}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </main>
    </>
  );
}

export async function getServerSideProps(context) {
  return {
    props: {},
  };
}
