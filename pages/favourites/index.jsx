import React from 'react';
import Card from '@components/Card';
import CardLoader from '@components/CardLoader';
import { useFetchBookmarks } from '@hooks/useFetchBookmarks';
import Layout from '../../components/layout/Layout';
import { Button } from '@nextui-org/react';
import styles from '@styles/Home.module.scss';
import { getServerSession } from 'next-auth';
import { signIn, useSession } from 'next-auth/react';
import Head from 'next/head';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const Favourites = (props) => {
  const { ref, inView } = useInView();
  const { query } = props;
  const { data: session } = useSession({ required: true });
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
    collection: '/favourites',
    query,
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
        <title>Mark3 | Favourites</title>
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
          <div className={styles.fw}>
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
          </div>
        </div>
      </main>
    </>
  );
};

Favourites.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default Favourites;

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
