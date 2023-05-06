import React from 'react';
import Card from '@components/Card';
import CardLoader from '@components/CardLoader';
import { useFetchBookmarks } from '@hooks/useFetchBookmarks';
import { Button } from '@nextui-org/react';
import styles from '@styles/Home.module.scss';
import { signIn, useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { getServerSession } from 'next-auth';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import Layout from '../../components/layout/Layout';


const Collection = (props) => {
  const router = useRouter();
  const { query } = props;

  const { ref, inView } = useInView();
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
    query,
    collection: router?.asPath,
    configs: [
      {
        enabled: !!session?.user?.email,
        refetechOnWindowFocus: false,
        getNextPageParam: (lastPage, pages) => {
          return parseInt(lastPage?.data?.currentPage) + 1;
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

Collection.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default Collection;

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  console.log(session);

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
