import { useState } from 'react';
import { VscFile, VscFolder, VscFolderOpened } from 'react-icons/vsc';
import styles from './ParentPreview.module.scss';

const ParentPreview = (props) => {
  const [showNested, setShowNested] = useState({});
  const { collection, preview, setSelectedCollection, selectedCollection } =
    props;

  const toggleNested = (name) => {
    setShowNested({ ...showNested, [name]: !showNested[name] });
  };

  return (
    <>
      {collection?.map((collection) => {
        return (
          <>
            <div
              className={styles.flex}
              onClick={() => setSelectedCollection(collection?.collection)}
            >
              {!!collection?.children?.length ? (
                showNested[collection?._id] ? (
                  <VscFolderOpened
                    className={styles.rootFolder}
                    onClick={() => toggleNested(collection?._id)}
                  />
                ) : (
                  <VscFolder
                    className={styles.rootFolder}
                    onClick={() => toggleNested(collection?._id)}
                  />
                )
              ) : (
                <VscFile
                  className={styles.rootFolder}
                  onClick={() => toggleNested(collection?._id)}
                />
              )}
              <span
                key={collection?._id}
                className={
                  selectedCollection === collection?.collection
                    ? styles.collectionActive
                    : styles.collection
                }
              >
                <div className={styles.collectionInfo}>
                  <p className={styles.collectionName}>
                    {collection?.collection}
                  </p>
                </div>
              </span>
            </div>
            <div
              className={styles.children}
              style={{ display: !showNested[collection?._id] && 'none' }}
            >
              {collection?.children && (
                <ParentPreview
                  selectedCollection={selectedCollection}
                  collection={collection?.children}
                  setSelectedCollection={setSelectedCollection}
                />
              )}
            </div>
          </>
        );
      })}
    </>
  );
};

export default ParentPreview;
