'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import CollectionTree from './CollectionTree';

const CollectionsList = (props: any) => {
  const { id, path } = props;
  const [showNested, setShowNested] = useState<any>({});

  const {
    data: collections,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['collections'],
    queryFn: () => fetch(`/api/collections/${id}`).then((res) => res.json()),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 mt-5">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <Skeleton className="w-full h-[42px]" key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="mt-5">
      <CollectionTree
        collections={collections}
        path={path}
        refetchCollections={refetch}
      />
    </div>
  );
};

export default CollectionsList;
