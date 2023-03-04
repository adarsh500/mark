import BookmarkModal from '@components/Modal';
import Navbar from '@components/Navbar';
import User from '@components/User';
import { useFetchCollections } from '@hooks/useFetchCollections';
import { Button, Input, Text } from '@nextui-org/react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useCallback, useState } from 'react';
import {
  HiBars3,
  HiChevronDown,
  HiChevronUp,
  HiOutlineArrowDownOnSquare,
  HiOutlineGlobeAlt,
  HiOutlineHeart,
  HiOutlineRectangleStack,
  HiOutlineTrash,
  HiPlus,
} from 'react-icons/hi2';
import styles from './Layout.module.scss';

const Layout = (props) => {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const { data: session } = useSession({ required: true });
  const [expanded, setExpanded] = useState(false);
  const [createObjectURL, setCreateObjectURL] = useState(null);
  const [file, setFile] = React.useState('');
  const [query, setQuery] = useState('');
  const [newCollection, setNewCollection] = useState('');
  const [displayCollections, setDisplayCollections] = useState(true);

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

  const deleteCollection = async (_id) => {
    const res = await fetch(`api/collections/${_id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    refetchCollections();
  };

  const { data: collectionsList, refetch: refetchCollections } =
    useFetchCollections({
      email: session?.user?.email,
      configs: [
        {
          enabled: !!session?.user?.email,
          refetchOnWindowFocus: false,
        },
      ],
    });

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
      setDisplayCollections(true);
      refetchCollections();
    },
    [newCollection, session]
  );

  const handler = () => setVisible(true);

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
            <span
              className={
                '/' === router.pathname ? styles.collActive : styles.coll
              }
            >
              <Link href={`/`}>
                <div className={styles.collectionInfo}>
                  <HiOutlineGlobeAlt className={styles.right} />
                  <p className={styles.collectionName}>All</p>
                </div>
              </Link>
            </span>

            <span
              className={
                '/favourites' === router.pathname
                  ? styles.collActive
                  : styles.coll
              }
            >
              <Link href={`/favourites`}>
                <div className={styles.collectionInfo}>
                  <HiOutlineHeart className={styles.right} />
                  <p className={styles.collectionName}>Favourites</p>
                </div>
              </Link>
            </span>

            <p
              className={styles.subMenu}
              onClick={() => setDisplayCollections(!displayCollections)}
            >
              Collections
              {displayCollections ? (
                <HiChevronUp className={styles.left} />
              ) : (
                <HiChevronDown className={styles.left} />
              )}
            </p>
            <div className={styles.scrollableMenu}>
              {displayCollections &&
                collectionsList?.data?.map((collection) => {
                  return (
                    <span
                      key={collection?._id}
                      className={
                        '/' + encodeURIComponent(collection?.collection) ===
                        router?.asPath
                          ? styles.collectionActive
                          : styles.collection
                      }
                    >
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

            <Text className={styles.text}>Add a new collection</Text>
            <Input
              clearable="true"
              contentRightStyling={false}
              fullWidth
              bordered
              contentRight={
                <HiPlus onClick={createCollection} className={styles.right} />
              }
              value={newCollection}
              onChange={(e) => setNewCollection(e.target.value)}
            />

            <div className={styles.uploadSection}>
              <Text className={styles.text}>Import bookmarks </Text>
              <div className={styles.upload}>
                <input
                  type="file"
                  clearable="true"
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
            collections={collectionsList?.data}
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
