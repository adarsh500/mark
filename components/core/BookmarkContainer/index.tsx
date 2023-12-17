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
    <div className="overflow-hidden">
      <div className="px-4">
        <div className="flex items-end gap-7 my-3 justify-end">
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
      </div>
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
      {!isLoading && isFetchingNextPage ? (
        <div role="status" className="mt-4 justify-center flex">
          <svg
            aria-hidden="true"
            className="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
        </div>
      ) : null}
    </div>
  );
};

export default BookmarkContainer;
