import { signOut, useSession } from 'next-auth/react';
import axios from 'axios';
import Head from 'next/head';
import React, { useEffect, useState, useCallback } from 'react';
import styles from './Layout.module.scss';
import Link from 'next/link';
import { Dropdown } from '@nextui-org/react';
import Navbar from '@components/Navbar';
import { Modal, Input, Button, Text, Badge } from '@nextui-org/react';
import {
  HiOutlineUserCircle,
  HiOutlineGlobeAlt,
  HiOutlineHeart,
  HiOutlineRectangleStack,
  HiXMark,
  HiChevronDown,
  HiChevronUp,
  HiPlus,
} from 'react-icons/hi2';

const Layout = (props) => {
  const { data: session } = useSession({ required: true });
  const [createObjectURL, setCreateObjectURL] = useState(null);
  const [file, setFile] = React.useState('');
  const [query, setQuery] = useState('');
  const [newCollection, setNewCollection] = useState('');
  const [isKeyReleased, setIsKeyReleased] = useState(false);
  const [state, setState] = useState('');
  const [link, setLink] = useState('');
  const [collection, setCollection] = useState('');
  const [tags, setTags] = useState([]);
  const [input, setInput] = useState('');
  const [visible, setVisible] = useState(false);
  const [collections, setCollections] = useState([]);
  const [displayCollections, setDisplayCollections] = useState(false);

  const handleUpload = async (formData) => {
    const config = {
      headers: { 'content-type': 'multipart/form-data' },
      onUploadProgress: (event) => {
        console.log(
          `Current progress:`,
          Math.round((event.loaded * 100) / event.total)
        );
      },
    };

    console.log('formdaa', formData);
    const response = await axios.post('/api/upload', formData, config);
    console.log('response', response.data);
  };

  const uploadToServer = async (event) => {
    const body = new FormData();
    body.append('file', file);
    body.append('email', session?.user?.email);
    const response = await fetch('/api/upload', {
      method: 'POST',
      body,
    });
  };

  const uploadToClient = (event) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];
      setFile(i);
      setCreateObjectURL(URL.createObjectURL(i));
    }
  };

  // const handleUpload = async (e) => {
  //   setFile(e.target.files[0]);
  //   const formData = new FormData();
  //   formData.append('name', 'bookmark');
  //   formData.append('file', file);

  //   const res = await fetch(`api/upload`, {
  //     method: 'POST',
  //     headers: { 'content-type': 'multipart/form-data' },
  //     body: formData,
  //   });

  //   console.log('resp', res.data);
  // };

  console.log(file);
  // console.log('idl', collections);

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

  const createBookmark = async () => {
    const res = await fetch(`api/bookmarks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: session.user.email,
        collection: collection,
        tags: tags,
        url: `https://${link}`,
        favourite: false,
      }),
    });
    closeHandler();
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

  const handleLink = (e) => {
    setLink(e.target.value);
  };

  const onChange = (e) => {
    const { value } = e.target;
    setInput(value);
  };

  const onKeyDown = (e) => {
    const { key } = e;
    const trimmedInput = input.trim();

    if (key === ',' && trimmedInput.length && !tags.includes(trimmedInput)) {
      e.preventDefault();
      setTags((prevState) => [...prevState, trimmedInput]);
      setInput('');
    }

    if (key === 'Backspace' && !input.length && tags.length && isKeyReleased) {
      const tagsCopy = [...tags];
      const poppedTag = tagsCopy.pop();
      e.preventDefault();
      setTags(tagsCopy);
      setInput(poppedTag);
    }

    setIsKeyReleased(false);
  };

  const onKeyUp = () => {
    setIsKeyReleased(true);
  };

  const closeHandler = () => {
    setVisible(false);
  };

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.home}>
        <aside className={styles.sidebar}>
          <Dropdown color={'default'}>
            <Dropdown.Button flat>
              <span className={styles.user}>
                <HiOutlineUserCircle className={styles.right} />
                <p>{session?.user?.name}</p>
              </span>
            </Dropdown.Button>
            <Dropdown.Menu>
              <Dropdown.Item
                key="delete"
                color="error"
                onClick={() => signOut()}
              >
                Sign Out
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <menu className={styles.menu}>
            <span className={styles.collection}>
              <Link href={`/`}>
                <div className={styles.collectionInfo}>
                  <HiOutlineGlobeAlt className={styles.right} />
                  <p className={styles.collectionName}>All</p>
                </div>
              </Link>
              <Badge isSquared color="primary" variant="bordered">
                1
              </Badge>
            </span>
            <span className={styles.collection}>
              <Link href={`/favourites`}>
                <div className={styles.collectionInfo}>
                  <HiOutlineHeart className={styles.right} />
                  <p className={styles.collectionName}>Favourites</p>
                </div>
              </Link>
              <Badge isSquared color="primary" variant="bordered">
                43
              </Badge>
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
            {displayCollections &&
              collections.map((collection) => {
                return (
                  <>
                    <Link href={`/${collection.collection}`}>
                      <a className={styles.collection}>
                        <div className={styles.collectionInfo}>
                          <HiOutlineRectangleStack className={styles.right} />

                          <p className={styles.collectionName}>
                            {collection?.collection}
                          </p>
                        </div>
                        <Badge isSquared color="primary" variant="bordered">
                          {/* {collection.size} */}
                        </Badge>
                      </a>
                    </Link>
                  </>
                );
              })}
            <Input
              clearable
              contentRightStyling={false}
              label="Create collection"
              fullWidth
              contentRight={<HiPlus onClick={createCollection} />}
              value={newCollection}
              onChange={(e) => setNewCollection(e.target.value)}
            />
            {/* <UiFileInputButton
              label="Upload Single File"
              uploadFileName="theFiles"
              onChange={handleUpload}
            /> */}
            <input type="file" name="myImage" onChange={uploadToClient} />
            <button
              className="btn btn-primary"
              type="submit"
              onClick={uploadToServer}
            >
              Send to server
            </button>
          </menu>
        </aside>

        <div className={styles.mainContent}>
          <Navbar
            handler={handler}
            closeHandler={closeHandler}
            query={query}
            setQuery={setQuery}
          />
          <Modal
            closeButton
            aria-labelledby="modal-title"
            open={visible}
            onClose={closeHandler}
          >
            <Modal.Header>
              <Text id="modal-title" size={18}>
                Create a bookmark
              </Text>
            </Modal.Header>
            <Modal.Body>
              <Input
                label="Enter URL"
                clearable
                bordered
                fullWidth
                color="primary"
                size="lg"
                labelLeft="https://"
                placeholder="github.com/adarsh500"
                value={link}
                onChange={handleLink}
              />

              <Text>Select collection</Text>
              <select
                className={styles.select}
                value={collection}
                onChange={(e) => setCollection(e.target.value)}
              >
                {collections?.map((collection) => (
                  <option key={collection._id} value={collection.name}>
                    {collection.collection}
                  </option>
                ))}
              </select>

              <div className={styles.tags}>
                {tags?.map((tag, index) => (
                  <Badge
                    isSquared
                    className={styles.badge}
                    color="warning"
                    variant="flat"
                    key={index}
                    disableOutline
                    onClick={() => deleteTag(index)}
                  >
                    # {tag}
                    <HiXMark className={styles.icon} />
                  </Badge>
                ))}
              </div>
              <Input
                clearable
                bordered
                label="Add Tags"
                color="primary"
                placeholder="comma seperated tags"
                onKeyDown={onKeyDown}
                onChange={onChange}
                onKeyUp={onKeyUp}
                value={input}
              />
            </Modal.Body>
            <Modal.Footer>
              <Button auto flat color="error" onClick={closeHandler}>
                Cancel
              </Button>
              <Button auto onClick={createBookmark}>
                Create
              </Button>
            </Modal.Footer>
          </Modal>
          {props.children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
