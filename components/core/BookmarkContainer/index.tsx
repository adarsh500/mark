'use client';
import { useFetchBookmarks } from '@/hooks/useFetchBookmarks';
import { useInView } from 'react-intersection-observer';
import React, { useEffect, useState } from 'react';
import Card from '../Card';

const BookmarkContainer = (props) => {
  const { query, session } = props;
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

  console.log(data);

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='flex flex-wrap columns-4'>
      {data &&
        data?.pages?.map((page) => {
          return (
            Object.keys(page?.data)
              .filter((key) => key !== 'currentPage')
              .map((key) => {
                return <Card key={page?.data[key]?._id} {...page?.data[key]} />;
              })
          );
        })}
    </div>
  );
};

export default BookmarkContainer;
