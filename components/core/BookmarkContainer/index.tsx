'use client';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useFetchBookmarks } from '@/hooks/useFetchBookmarks';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import Card from '../Card';
import { Label } from '@/components/ui/label';
import Spinner from '@/components/Spineer';

const BookmarkContainer = (props) => {
  const { session, favourite, collectionId, searchParams } = props;
  const { ref, inView } = useInView();
  const [sortBy, setSortBy] = useState('created_at');
  const [orderBy, setOrderBy] = useState('desc');

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useFetchBookmarks({
      page: 0,
      user_id: session?.user?.id,
      query: searchParams?.q ?? '',
      favourite,
      collection_id: collectionId,
      configs: [
        {
          enabled: !!session?.user?.id,
          staleTime: 1000 * 10,
          refetechOnWindowFocus: false,
          getNextPageParam: (lastPage, page) => {
            if (Object.keys(lastPage?.data).length === 1) return undefined;
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

  if (isLoading) {
    return (
      <div className="flex flex-wrap">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((_, index) => (
          <Skeleton
            className="border border-solid border-transparent rounded-md w-[calc(calc(100%-102px)/4)] max-w-full min-h-[300px] m-3 transition-all ease-linear"
            key={index}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col p-4 pt-2 overflow-hidden">
      {!!data && !!data.pages.length && (
        <div className="px-4 flex-shrink-0 flex items-end gap-7 my-3 justify-end">
          <div className="flex items-center gap-2">
            <Label>Sort by</Label>
            <Select
              defaultValue={sortBy}
              onValueChange={(value) => {
                setSortBy(value);
              }}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="created_at">Created at</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-3">
            <Label>Order by</Label>
            <Select
              defaultValue={orderBy}
              onValueChange={(value) => {
                setOrderBy(value);
              }}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Ascending</SelectItem>
                <SelectItem value="desc">Descending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      <div className="flex flex-wrap columns-4 flex-1 overflow-auto">
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

      {!isLoading && isFetchingNextPage ? <Spinner /> : null}
    </div>
  );
};

export default BookmarkContainer;
