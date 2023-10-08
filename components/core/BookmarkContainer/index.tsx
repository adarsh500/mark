'use client';
import { useFetchBookmarks } from '@/hooks/useFetchBookmarks';
import { useInView } from 'react-intersection-observer';
import React, { useEffect, useState } from 'react';

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

  return <div>BookmarkContainer</div>;
};

export default BookmarkContainer;
