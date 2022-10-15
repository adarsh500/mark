import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Card.module.scss';
// import { Image } from '@nextui-org/react';

const Card = (props) => {
  const { image, title, description, site, date } = props;

  return (
    <Link href={`/abc`}>
      <a className={styles.card}>
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
          <p className={styles.title}>{title}</p>
          <p className={styles.description}>{description}</p>

          <div className={styles.info}>
            <p className={styles.site}>{site}</p>
            <p className={styles.date}>{date}</p>
          </div>
        </div>
      </a>
    </Link>
  );
};

export default Card;
