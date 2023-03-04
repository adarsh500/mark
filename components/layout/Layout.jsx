import BookmarkModal from '@components/Modal';
import Navbar from '@components/Navbar';
import User from '@components/User';
import { useCreateCollection } from '@hooks/useCreateCollection';
import { useFetchCollections } from '@hooks/useFetchCollections';
import { Button, Input, Text } from '@nextui-org/react';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { BsCaretDownFill, BsCaretRightFill } from 'react-icons/bs';
import { CgAddR } from 'react-icons/cg';
import {
  HiBars3,
  HiChevronDown,
  HiChevronUp,
  HiOutlineArrowDownOnSquare,
  HiOutlineGlobeAlt,
  HiOutlineHeart,
  HiOutlineTrash,
  HiPlus,
} from 'react-icons/hi2';
import styles from './Layout.module.scss';

const Parent = (props) => {
  const [showNested, setShowNested] = useState({});
  const { collection, path } = props;

  const toggleNested = (name) => {
    setShowNested({ ...showNested, [name]: !showNested[name] });
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
                <div className={styles.flex}>
                  <CgAddR
                    className={styles.actionIcon}
                    // onClick={() => deleteCollection(collection?._id)}
                  />
                  <HiOutlineTrash
                    className={styles.actionIcon}
                    color="red"
                    // onClick={() => deleteCollection(collection?._id)}
                  />
                </div>
              </span>
              
            </div>
            <div
              className={styles.children}
              style={{ display: !showNested[collection?._id] && 'none' }}
            >
              {collection?.children && (
                <Parent collection={collection?.children} path={path} />
              )}
            </div>
          </>
        );
      })}
    </>
  );
};

const Layout = (props) => {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const { data: session } = useSession({ required: true });
  const [expanded, setExpanded] = useState(true);
  const [createObjectURL, setCreateObjectURL] = useState(null);
  const [file, setFile] = React.useState('');
  const [query, setQuery] = useState('');
  const [newCollection, setNewCollection] = useState('');
  const [displayCollections, setDisplayCollections] = useState(true);
  const coll = useCreateCollection({
    configs: [
      {
        onSuccess: () => {
          refetchCollections();
        },
      },
    ],
  });

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

  const createCollection = () => {
    coll.mutate({
      email: session?.user?.email,
      collection: newCollection,
    });
  };

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
              {displayCollections && !!collectionsList?.data?.length ? (
                <Parent
                  collection={collectionsList?.data}
                  path={router?.asPath}
                />
              ) : null}
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
