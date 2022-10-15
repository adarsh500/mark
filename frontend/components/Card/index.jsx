import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Card.module.scss';
import { Button, Text } from '@nextui-org/react';

import { HiOutlineClipboardCopy, HiOutlineTrash } from 'react-icons/hi';
// import { Image } from '@nextui-org/react';

const Card = (props) => {
  const { image, title, description, url, date } = props;

  const copyToClipboard = () => {};

  const deleteBookmark = () => {};

  return (
    // <Link href={`/abc`}>
      <div className={styles.card}>
        <Image
          className={styles.image}
          // loader={myLoader}
          src={image}
          width={250}
          height={150}
          layout="responsive"
          alt="Link og:image"
          // placeholder="blur"
          // blurDataURL=''
          objectFit="cover"
        ></Image>

        <div className={styles.subContent}>
          <Text h4 bold>
            {title}
          </Text>
          <Text size={14} className={styles.description}>
            {description}
          </Text>

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
            onClick={copyToClipboard}
            icon={<HiOutlineClipboardCopy className={styles.icons} />}
          ></Button>
          <Button
            auto
            className={styles.button}
            // size="xs"
            flat
            color="error"
            onClick={deleteBookmark}
            icon={<HiOutlineTrash className={styles.icons} />}
          ></Button>
        </div>
      </div>
    // </Link>
  );
};

export default Card;
