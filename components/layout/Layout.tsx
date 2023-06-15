import CollectionTree from '@components/CollectionTree';
import Navbar from '@components/Navbar';
import User from '@components/User';
import { useCreateCollection } from '@hooks/useCreateCollection';
import { useFetchCollections } from '@hooks/useFetchCollections';
import { Button, Input } from '@nextui-org/react';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, {
  cloneElement,
  isValidElement,
  useCallback,
  useState,
} from 'react';
import { BsCaretDownFill, BsCaretRightFill } from 'react-icons/bs';
import {
  HiBars3,
  HiOutlineArrowDownOnSquare,
  HiOutlineGlobeAlt,
  HiPlus,
} from 'react-icons/hi2';
import { Toaster, toast } from 'sonner';
import styles from './Layout.module.scss';
const BookmarkModal = dynamic(() => import('../Modal'), {
  ssr: false,
});
const CollectionModal = dynamic(() => import('../CollectionModal'), {
  ssr: false,
});

const Layout = (props) => {
  const { children } = props;
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [visibleCollection, setVisibleCollection] = useState(false);
  const { data: session } = useSession({ required: true });
  const [expanded, setExpanded] = useState(true);
  const [createObjectURL, setCreateObjectURL] = useState(null);
  const [file, setFile] = React.useState('');
  const [query, setQuery] = useState('');
  const [newCollection, setNewCollection] = useState('');
  const [parent, setParent] = useState('');
  const [displayCollections, setDisplayCollections] = useState(true);
  const coll = useCreateCollection({
    configs: [
      {
        onSuccess: () => {
          toast.success('New collection has been created');
          refetchCollections();
        },
        onError: (error) => {
          console.log(error);
          toast.error(error.response.data.message);
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

    const promise = () => new Promise((resolve) => setTimeout(resolve, 4000));

    toast.promise(promise, {
      loading: 'Importing bookmarks...',
      success: 'Successfully imported bookmarks',
      error: 'Could not import bookmarks',
    });
  };

  const uploadToClient = useCallback((event) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];
      setFile(i);
      setCreateObjectURL(URL.createObjectURL(i));
    }
  }, []);

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

  const createCollection = useCallback(() => {
    if (newCollection === '') {
      toast.error('Collection name cannot be empty');
      return;
    }
    coll.mutate({
      email: session?.user?.email,
      collection: newCollection,
      parent: '',
    });
    setNewCollection('');
  }, []);

  const handler = () => setVisible(true);

  function recursiveMap(children, fn) {
    return React.Children.map(children, (child) => {
      if (!React.isValidElement(child) || typeof child.type == 'string') {
        return child;
      }

      if (child.props.children) {
        child = React.cloneElement(child, {
          children: recursiveMap(child.props.children, fn),
        });
      }

      return fn(child);
    });
  }

  const childrenWithProps = recursiveMap(children, (child) => {
    if (isValidElement(child)) {
      return cloneElement(child, { query: query });
    }

    return child;
  });

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
            {[
              { path: '/', label: 'All' },
              { path: '/favourites', label: 'Favourites' },
            ].map((route) => (
              <span
                className={
                  route.path === router.pathname
                    ? styles.collActive
                    : styles.coll
                }
              >
                <Link href={route.path}>
                  <div className={styles.collectionInfo}>
                    <HiOutlineGlobeAlt className={styles.right} />
                    <p className={styles.collectionName}>{route.label}</p>
                  </div>
                </Link>
              </span>
            ))}

            <p
              className={styles.subMenu}
              onClick={() => setDisplayCollections(!displayCollections)}
            >
              Collections
              {displayCollections ? (
                <BsCaretDownFill className={styles.left} />
              ) : (
                <BsCaretRightFill className={styles.left} />
              )}
            </p>
            <div className={styles.scrollableMenu}>
              {displayCollections && !!collectionsList?.data?.length ? (
                <CollectionTree
                  collection={collectionsList?.data}
                  path={router?.asPath}
                  coll={coll}
                  setVisibleCollection={setVisibleCollection}
                  setParent={setParent}
                  refetchCollections={refetchCollections}
                />
              ) : null}
            </div>
          </menu>
          <p className={styles.text}>Add a new collection</p>
          <Input
            clearable={true}
            contentRightStyling={false}
            className={styles.input}
            contentRight={
              <HiPlus onClick={createCollection} className={styles.right} />
            }
            value={newCollection}
            onChange={(e) => setNewCollection(e.target.value)}
          />

          <div className={styles.uploadSection}>
            <p className={styles.text}>Import bookmarks</p>
            <div className={styles.upload}>
              <input
                type="file"
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
            email={session?.user?.email}
          />
          <CollectionModal
            parent={parent}
            refetchCollections={refetchCollections}
            setParent={setParent}
            visible={visibleCollection}
            setVisible={setVisibleCollection}
            email={session?.user?.email}
          />
          <Toaster position="top-right" richColors />
          {childrenWithProps}
        </div>
      </div>
    </div>
  );
};

export default Layout;
