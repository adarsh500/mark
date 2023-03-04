import BookmarkModal from '@components/Modal';
import Navbar from '@components/Navbar';
import User from '@components/User';
import { Button, Input, Text } from '@nextui-org/react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import React, { useCallback, useEffect, useState } from 'react';
import { HiOutlineTrash } from 'react-icons/hi';
import {
  HiBars3,
  HiChevronDown,
  HiChevronUp,
  HiOutlineArrowDownOnSquare,
  HiOutlineGlobeAlt,
  HiOutlineHeart,
  HiOutlineRectangleStack,
  HiPlus,
} from 'react-icons/hi2';
import styles from './Layout.module.scss';

const Layout = (props) => {
  const [visible, setVisible] = useState(false);
  const { data: session } = useSession({ required: true });
  const [expanded, setExpanded] = useState(false);
  const [createObjectURL, setCreateObjectURL] = useState(null);
  const [file, setFile] = React.useState('');
  const [query, setQuery] = useState('');
  const [newCollection, setNewCollection] = useState('');
  const [collections, setCollections] = useState([]);
  const [displayCollections, setDisplayCollections] = useState(false);

  const uploadToServer = async (event) => {
    const body = new FormData();
    body.append('file', file);
    body.append('email', session?.user?.email);
    const res = await fetch('/api/upload', {
      method: 'POST',
      body,
    });
    const data = await res.json();
  };

  const uploadToClient = (event) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];
      setFile(i);
      setCreateObjectURL(URL.createObjectURL(i));
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getCollection = useCallback(async () => {
    // setFetching(true);
    try {
      const res = await fetch(`api/collections/${session?.user?.email}`);
      const data = await res.json();
      setCollections(data);
      // setFetching(false);
    } catch (e) {
      console.log(e);
      // setFetching(false);
    }
  });

  const deleteCollection = async (_id) => {
    const res = await fetch(`api/collections/${_id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    getCollection();
  };

  const createCollection = useCallback(
    async (e) => {
      e.preventDefault();
      const res = await fetch(`api/collections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: session.user.email,
          collection: newCollection,
        }),
      });
      // console.log('colls', data);
      setDisplayCollections(true);
    },
    [newCollection, session]
  );

  useEffect(() => {
    getCollection();
  }, [displayCollections, visible]);

  const handler = () => setVisible(true);

  const changeHandler = (next) => {
    setVisible(next);
  };

  return (
    <div>
      <div className={styles.home}>
        <aside className={expanded ? styles.sidebar : styles.sidebarClose}>
          <div className={styles.hamburger}>
            <User expanded={expanded} userName={session?.user?.name} />
            <Button
              icon={<HiBars3 />}
              auto
              flat
              className={styles.hamburgerIcon}
              onClick={(e) => setExpanded(!expanded)}
            ></Button>
          </div>

          <div className={styles.hamburger}></div>

          <menu className={styles.menu}>
            <span className={styles.coll}>
              <Link href={`/`}>
                <div className={styles.collectionInfo}>
                  <HiOutlineGlobeAlt className={styles.right} />
                  <p className={styles.collectionName}>All</p>
                </div>
              </Link>
              {/* <Badge isSquared color="primary" variant="bordered">
                1
              </Badge> */}
            </span>

            <span className={styles.coll}>
              <Link href={`/favourites`}>
                <div className={styles.collectionInfo}>
                  <HiOutlineHeart className={styles.right} />
                  <p className={styles.collectionName}>Favourites</p>
                </div>
              </Link>
              {/* <Badge isSquared color="primary" variant="bordered">
                43
              </Badge> */}
            </span>

            <p
              className={styles.subMenu}
              onClick={() => setDisplayCollections(!displayCollections)}
            >
              collections
              {displayCollections ? (
                <HiChevronUp className={styles.left} />
              ) : (
                <HiChevronDown className={styles.left} />
              )}
            </p>
            <div className={styles.scrollableMenu}>
              {displayCollections &&
                collections.map((collection) => {
                  return (
                    <span key={collection?._id} className={styles.collection}>
                      <Link href={`/${collection.collection}`}>
                        <a
                        // className={styles.collection}
                        >
                          <div className={styles.collectionInfo}>
                            <HiOutlineRectangleStack className={styles.right} />

                            <p className={styles.collectionName}>
                              {collection?.collection}
                            </p>
                          </div>
                        </a>
                      </Link>
                      <HiOutlineTrash
                        className={styles.small}
                        color="red"
                        onClick={() => deleteCollection(collection?._id)}
                      />
                    </span>
                  );
                })}
            </div>

            <Input
              clearable="true"
              contentRightStyling={false}
              label="Create collection"
              fullWidth
              // color="default"
              bordered
              contentRight={
                <HiPlus onClick={createCollection} className={styles.right} />
              }
              value={newCollection}
              onChange={(e) => setNewCollection(e.target.value)}
            />
            {/* <UiFileInputButton
              label="Upload Single File"
              uploadFileName="theFiles"
              onChange={handleUpload}
            /> */}

            <div className={styles.uploadSection}>
              <Text>Upload bookmarks from other browser</Text>
              <div className={styles.upload}>
                <input
                  type="file"
                  clearable="true"
                  // contentRightStyling={false}
                  // label="Import Bookmarks"
                  name="myImage"
                  onChange={uploadToClient}
                  className={styles.inputFile}
                />

                <Button
                  className={styles.send}
                  auto
                  flat
                  type="submit"
                  color="success"
                  onClick={uploadToServer}
                  icon={<HiOutlineArrowDownOnSquare />}
                ></Button>
              </div>
            </div>
          </menu>
        </aside>

        <div className={styles.mainContent}>
          <Navbar
            handler={handler}
            query={query}
            setQuery={setQuery}
            expanded={expanded}
            setExpanded={setExpanded}
          />
          <BookmarkModal
            collections={collections}
            visible={visible}
            setVisible={setVisible}
            email={session?.user.email}
          />
          {props.children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
