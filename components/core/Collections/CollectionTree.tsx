'use client';
import { memo, useCallback, useState } from 'react';
import { HiChevronDown, HiChevronRight } from 'react-icons/hi';
import Collection from './Collection';

const CollectionTree = (props: any) => {
  const {
    collections,
    deleteCollection: mutate,
    createCollection,
    userId,
  } = props;
  const [showNested, setShowNested] = useState<any>({});

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
    <div className="overflow-scroll flex-1 relative">
      {collections?.map((collection: any) => {
        const { collection_name = '', children = [], _id = '' } = collection;
        const isParent = !!children.length;
        return (
          <div key={_id}>
            <Collection
              id={_id}
              label={collection_name}
              href={`/collection/${_id}`}
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
              createCollection={createCollection}
            />
            {showNested?.[_id] && isParent && (
              <div className="ml-4">
                <CollectionTree
                  collections={children}
                  deleteCollection={mutate}
                  userId={userId}
                  createCollection={createCollection}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default memo(CollectionTree);
