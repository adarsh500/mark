import { Popover } from '@nextui-org/react';
import Link from 'next/link';
import { memo, useCallback, useState } from 'react';
import {
  BsCaretDownFill,
  BsCaretRightFill,
  BsThreeDotsVertical,
} from 'react-icons/bs';
import { CgAddR } from 'react-icons/cg';
import { HiOutlineTrash } from 'react-icons/hi2';
import styles from './CollectionTree.module.scss';

const Component = (props) => {
  const [showNested, setShowNested] = useState({});
  const { collection, path, coll, setVisibleCollection, setParent } = props;

  const toggleNested = useCallback((name) => {
    setShowNested({ ...showNested, [name]: !showNested[name] });
  }, []);

  const handleCreateCollection = useCallback((parent) => {
    setParent(parent);
    setVisibleCollection(true);
  }, []);

  const deleteCollection = async (_id) => {
    await fetch(`api/collections/${_id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    refetchCollections();
    toast.error('Deleted a collection');
  };

  return (
    <>
      {collection?.map((collection) => {
        return (
          <>
            <div className={styles.flex}>
              {!!collection?.children?.length ? (
                showNested[collection?._id] ? (
                  <BsCaretDownFill
                    className={styles.rootFolder}
                    onClick={() => toggleNested(collection?._id)}
                  />
                ) : (
                  <BsCaretRightFill
                    className={styles.rootFolder}
                    onClick={() => toggleNested(collection?._id)}
                  />
                )
              ) : null}
              <span
                key={collection?._id}
                className={
                  '/' + encodeURIComponent(collection?.collection) === path
                    ? styles.collectionActive
                    : styles.collection
                }
              >
                <Link href={`/${collection?.collection}`}>
                  <a>
                    <div className={styles.collectionInfo}>
                      <p className={styles.collectionName}>
                        {collection?.collection}
                      </p>
                    </div>
                  </a>
                </Link>
                <Popover>
                  <Popover.Trigger>
                    <button className={styles.noStyle}>
                      <BsThreeDotsVertical className={styles.menuIcon} />
                    </button>
                  </Popover.Trigger>
                  <Popover.Content className={styles.popover}>
                    <span
                      className={styles.popoverButtons}
                      onClick={() => handleCreateCollection(collection?._id)}
                    >
                      <CgAddR className={styles.actionIcon} />
                      Add
                    </span>
                    <span
                      className={styles.popoverButtons}
                      onClick={() => deleteCollection(collection?._id)}
                    >
                      <HiOutlineTrash
                        className={styles.actionIcon}
                        color="red"
                      />
                      Delete
                    </span>
                  </Popover.Content>
                </Popover>
              </span>
            </div>
            <div
              className={styles.children}
              style={{ display: !showNested[collection?._id] && 'none' }}
            >
              {collection?.children && (
                <Component
                  collection={collection?.children}
                  path={path}
                  coll={coll}
                  setVisibleCollection={setVisibleCollection}
                  setParent={setParent}
                  deleteCollection={deleteCollection}
                />
              )}
            </div>
          </>
        );
      })}
    </>
  );
};

const CollectionTree = memo(Component);
export default CollectionTree;
