'use client';
import { memo, useCallback, useState } from 'react';
import { HiChevronDown, HiChevronRight } from 'react-icons/hi';
import Collection from './Collection';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';

const CollectionTree = (props: any) => {
  const { collections, refetchCollections, userId } = props;
  const [showNested, setShowNested] = useState<any>({});
  const { toast } = useToast();

  const { mutate } = useMutation(
    (id: string) =>
      fetch(`/api/collections`, {
        method: 'DELETE',
        body: JSON.stringify({ id, user_id: 0 }),
      }),
    {
      onSuccess: () => {
        toast({ description: 'Collection deleted successfully' });
        refetchCollections();
      },
      onError: (err) => {
        console.log(err);
        toast({
          variant: 'destructive',
          title: 'Something went wrong',
          description: 'shit',
        });
      },
    }
  );

  const deleteCollection = useCallback((e: Event, id: string) => {
    e.preventDefault();
    mutate(id);
  }, []);

  const toggleNested = useCallback((e: any, id: string) => {
    e.preventDefault();
    setShowNested((prev: any) => {
      return { ...prev, [id]: !prev[id] };
    });
  }, []);

  return (
    <>
      {collections?.map((collection: any) => {
        const { collection_name = '', children = [], _id = '' } = collection;
        const isParent = !!children.length;
        return (
          <div key={_id}>
            <Collection
              id={_id}
              label={collection_name}
              href={`/collections/${_id}`}
              icon={
                isParent ? (
                  !!showNested?.[_id] ? (
                    <HiChevronDown
                      onClick={(e: Event) => toggleNested(e, _id)}
                    />
                  ) : (
                    <HiChevronRight
                      onClick={(e: Event) => toggleNested(e, _id)}
                    />
                  )
                ) : null
              }
              hasActions
              deleteCollection={deleteCollection}
            />
            {showNested?.[_id] && isParent && (
              <div className="ml-4">
                <CollectionTree
                  collections={children}
                  refetchCollections={refetchCollections}
                  userId={userId}
                />
              </div>
            )}
          </div>
        );
      })}
    </>
  );
};

export default memo(CollectionTree);
