'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import CollectionTree from './CollectionTree';

const CollectionsList = (props: any) => {
  const { id } = props;

  const {
    data: collections,
    isLoading,
    isError,
    refetch: refetchCollections,
  } = useQuery({
    queryKey: ['collections'],
    queryFn: () => fetch(`/api/collections/${id}`).then((res) => res.json()),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
          <Skeleton className="w-full h-[42px]" key={i} />
        ))}
      </div>
    );
  }

  return (
    <CollectionTree
      userId={id}
      collections={collections}
      refetchCollections={refetchCollections}
    />
  );
};

export default CollectionsList;
