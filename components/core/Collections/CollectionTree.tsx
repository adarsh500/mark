'use client';
import { memo, useCallback, useState } from 'react';
import { HiChevronDown, HiChevronRight } from 'react-icons/hi';
import Collection from './Collection';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';

const CollectionTree = (props: any) => {
  const { collections, refetchCollections } = props;
  const [showNested, setShowNested] = useState<any>({});
  const { toast } = useToast();

  const { mutate } = useMutation(
    (id: string) => fetch(`/api/collections/${id}`, { method: 'DELETE' }),
    {
      onSuccess: () => {
        refetchCollections();
        toast({ description: 'Collection deleted successfully' });
      },
      onError: (err) => {
        toast({
          variant: 'destructive',
          title: 'Something went wrong',
          description: err as string,
        });
      },
    }
  );

  const deleteCollection = useCallback((id: string) => {
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
        const { collection_name, children, _id } = collection;
        const isParent = !!children.length;
        return (
          <div key={_id}>
            <Collection
              label={collection_name}
              href={`/collections/${_id}`}
              icon={
                isParent ? (
                  !!showNested[_id] ? (
                    <HiChevronDown onClick={(e) => toggleNested(e, _id)} />
                  ) : (
                    <HiChevronRight onClick={(e) => toggleNested(e, _id)} />
                  )
                ) : null
              }
              hasActions
            />
            {showNested[_id] && isParent && (
              <div className="ml-4">
                <CollectionTree collections={children} />
              </div>
            )}
          </div>
        );
      })}
    </>
  );
};

export default memo(CollectionTree);
