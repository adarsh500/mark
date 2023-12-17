'use client';

import Modal from '@/components/core/Collections/CollectionModal';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { HiPlus } from 'react-icons/hi';
import CollectionTree from './CollectionTree';

const CollectionsList = (props: any) => {
  const { toast } = useToast();
  const { id } = props;
  const [showModal, setShowModal] = useState(false);
  const [parentId, setParentId] = useState('');

  const {
    data: collections,
    isLoading,
    isError,
    refetch: refetchCollections,
  } = useQuery({
    queryKey: ['collections'],
    queryFn: () => fetch(`/api/collections/${id}`).then((res) => res.json()),
    enabled: !!id,
    refetchOnWindowFocus: false,
  });

  const { mutate: create } = useMutation(
    async (inputs: any) => {
      const { collection_name = '', parent_id = '' } = inputs;
      try {
        const data = await fetch('/api/collections', {
          method: 'POST',
          body: JSON.stringify({
            user_id: id,
            collection_name,
            parent_id,
          }),
        });
        if (data.ok) {
          return data.json();
        } else {
          throw new Error();
        }
      } catch (error) {
        throw error.response;
      }
    },
    {
      onSuccess: () => {
        toast({ description: 'Created collection successfully' });
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

  const handleShowModal = useCallback((state: boolean, parent_id: string) => {
    setShowModal(state ? state : (prev) => !prev);
    setParentId(parent_id ?? '');
  }, []);

  if (isLoading) {
    return (
      <>
        <span className="my-4 mx-2 text-base font-semibold flex items-center justify-between">
          Collections
        </span>
        <div className="flex flex-col gap-2">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <Skeleton className="w-full h-[42px]" key={i} />
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      <span className="my-4 mx-2 text-base font-semibold flex items-center justify-between">
        Collections
        <Modal
          parentId={parentId}
          open={showModal}
          onOpenChange={handleShowModal}
          createCollection={create}
          trigger={
            <div className="hover:bg-accent p-1 rounded-sm">
              <HiPlus />
            </div>
          }
        ></Modal>
      </span>
      <CollectionTree
        userId={id}
        collections={collections}
        deleteCollection={mutate}
        createCollection={handleShowModal}
      />
    </>
  );
};

export default CollectionsList;
