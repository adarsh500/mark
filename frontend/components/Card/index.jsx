import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Card.module.scss';
import { Button, Text, Badge } from '@nextui-org/react';

import {
  HiOutlineClipboardCopy,
  HiOutlineTrash,
  HiOutlineHeart,
} from 'react-icons/hi';
// import { Image } from '@nextui-org/react';

const Card = (props) => {
  const { image, title, description, url, date, tags } = props;

  const copyToClipboard = () => {};

  const deleteBookmark = () => {};

  const addToFavourite = () => {};

  return (
    // <Link href={`/abc`}>
    <div className={styles.card}>
      <Image
        className={styles.image}
        src={image}
        width={250}
        height={150}
        layout="responsive"
        alt="Link og:image"
        objectFit="cover"
      ></Image>

      <div className={styles.subContent}>
        <Text h4 bold>
          {title}
        </Text>
        <Text size={14} className={styles.description}>
          {description}
        </Text>

        <div className={styles.tags}>
          {tags?.map((tag, index) => (
            <Badge
              isSquared
              className={styles.badge}
              color="warning"
              variant="flat"
              key={index}
              disableOutline
            >
              # {tag}
            </Badge>
          ))}
        </div>

        <div className={styles.info}>
          <p className={styles.site}>{url}</p>
          <p className={styles.date}>{date}</p>
        </div>
      </div>

      <div className={styles.overlay}>
        <Button
          auto
          className={styles.button}
          // size="xs"
          flat
          color="error"
          onClick={deleteBookmark}
          icon={<HiOutlineTrash className={styles.icons} />}
        ></Button>

        <Button
          auto
          className={styles.button}
          // size="xs"
          flat
          color="error"
          onClick={addToFavourite}
          icon={<HiOutlineHeart className={styles.icons} />}
        ></Button>

        <Button
          auto
          className={styles.button}
          // size="xs"
          flat
          onClick={copyToClipboard}
          icon={<HiOutlineClipboardCopy className={styles.icons} />}
        ></Button>
      </div>
    </div>
    // </Link>
  );
};

export default Card;
