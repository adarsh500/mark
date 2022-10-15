import React, { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.scss';
import { useSession, signIn, signOut } from 'next-auth/react';
import Navbar from '@components/Navbar';
import mql from '@microlink/mql';
import Card from '@components/Card';
import { HiXMark } from 'react-icons/hi2';
import {
  Modal,
  Input,
  Row,
  Checkbox,
  Button,
  Text,
  Badge,
} from '@nextui-org/react';
// import { getMetaData } from 'metadata-scraper';
import { collections } from 'layout/Layout';

const cards = [
  {
    id: 1,
    image:
      'https://www.freecodecamp.org/news/content/images/2021/03/discordjs.png',
    title: 'Anurag Hazra - Creative Web Designer',
    description:
      'Anurag Hazra - Creative frontEnd web developer who loves javascript and modern web technologies',
    url: 'anuraghazra.github.io',
    date: 'Apr 2, 2021',
    tags: ['xyz', 'blah', 'abc'],
  },
  {
    id: 2,
    image: 'https://picsum.photos/seed/picsum/200/300',
    title: 'Anurag Hazra - Creative Web Designer',
    description:
      'Anurag Hazra - Creative frontEnd web developer who loves javascript and modern web technologies',
    url: 'anuraghazra.github.io',
    date: 'Apr 2, 2021',
  },
  {
    id: 3,
    image: 'https://picsum.photos/id/237/400/300',
    title: 'Anurag Hazra - Creative Web Designer',
    description:
      'Anurag Hazra - Creative frontEnd web developer who loves javascript and modern web technologies',
    url: 'anuraghazra.github.io',
    date: 'Apr 2, 2021',
  },
  {
    id: 4,
    image: 'https://picsum.photos/id/1/200/300',
    title: 'Anurag Hazra - Creative Web Designer',
    description:
      'Anurag Hazra - Creative frontEnd web developer who loves javascript and modern web technologies',
    url: 'anuraghazra.github.io',
    date: 'Apr 2, 2021',
  },
  {
    id: 5,
    image: 'https://picsum.photos/id/217/400/300',
    title: 'Anurag Hazra - Creative Web Designer',
    description:
      'Anurag Hazra - Creative frontEnd web developer who loves javascript and modern web technologies',
    url: 'anuraghazra.github.io',
    date: 'Apr 2, 2021',
  },
  {
    id: 6,
    image: 'https://picsum.photos/id/17/400/300',
    title: 'Anurag Hazra - Creative Web Designer',
    description:
      'Anurag Hazra - Creative frontEnd web developer who loves javascript and modern web technologies',
    url: 'anuraghazra.github.io',
    date: 'Apr 2, 2021',
  },
  {
    id: 7,
    image: 'https://picsum.photos/id/437/400/300',
    title: 'Anurag Hazra - Creative Web Designer',
    description:
      'Anurag Hazra - Creative frontEnd web developer who loves javascript and modern web technologies',
    url: 'anuraghazra.github.io',
    date: 'Apr 2, 2021',
  },
  {
    id: 8,
    image: 'https://picsum.photos/id/27/400/300',
    title: 'Anurag Hazra - Creative Web Designer',
    description:
      'Anurag Hazra - Creative frontEnd web developer who loves javascript and modern web technologies',
    url: 'anuraghazra.github.io',
    date: 'Apr 2, 2021',
  },
];

export default function Home() {
  const { data: session } = useSession({ required: true });
  const [isKeyReleased, setIsKeyReleased] = useState(false);
  const [input, setInput] = useState('');
  const [link, setLink] = useState('');
  const [tags, setTags] = useState([]);
  const [collection, setCollection] = useState('');
  const [query, setQuery] = useState('');
  const [sortValue, setSortValue] = useState('id');
  const [visible, setVisible] = React.useState(false);
  const handler = () => setVisible(true);

  console.log(tags);
  console.log(link);

  const deleteTag = (index) => {
    setTags((prevState) => prevState.filter((tag, i) => i !== index));
  };

  const closeHandler = () => {
    setVisible(false);
  };

  const handleChange = (e) => {
    setQuery(e.target.value);
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

  if (!session) {
    return (
      <>
        Not signed in <br />
        <button onClick={() => signIn()}>Sign in</button>
      </>
    );
  }

  return (
    <>
      <Navbar handler={handler} closeHandler={closeHandler} />
      <main className={styles.main}>
        <div className={styles.cardWrapper}>
          {cards.map((card) => (
            <Card key={card.id} {...card} />
          ))}
        </div>
      </main>
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
              <option key={collection.id} value={collection.name}>
                {collection.name}
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
            // onKeyUp={onKeyUp}
            value={input}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button auto flat color="error" onClick={closeHandler}>
            Cancel
          </Button>
          <Button auto onClick={closeHandler}>
            Create
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
