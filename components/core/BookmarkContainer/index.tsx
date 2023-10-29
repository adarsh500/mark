'use client';
import { Button } from '@/components/ui/button';
import { useFetchBookmarks } from '@/hooks/useFetchBookmarks';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import Card from '../Card';

const BookmarkContainer = (props) => {
  const { query, session, favourite, collectionId } = props;
  const { ref, inView } = useInView();
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
    user_id: session?.user?.id,
    query,
    favourite,
    collection_id: collectionId,
    configs: [
      {
        enabled: !!session?.user?.id,
        staleTime: 1000 * 10,
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

  return (
    <div className="flex flex-wrap columns-4">
      {data &&
        data?.pages?.map((page) => {
          return Object.keys(page?.data)
            .filter((key) => key !== 'currentPage')
            .map((key) => {
              return <Card key={page?.data[key]?._id} {...page?.data[key]} />;
            });
        })}
      {hasNextPage ? (
        <Button
          onClick={() => fetchNextPage()}
          ref={ref}
          disabled={!hasNextPage || isFetchingNextPage}
          className="invisible"
        >
          {isFetchingNextPage
            ? 'Loading more...'
            : hasNextPage
            ? 'Load Newer'
            : 'Nothing more to load'}
        </Button>
      ) : null}
    </div>
  );
};

export default BookmarkContainer;
