import { signOut, useSession } from 'next-auth/react';
import Head from 'next/head';
import React, { useState } from 'react';
import styles from './Layout.module.scss';
import classNames from 'classnames';
import Link from 'next/link';
import { Dropdown } from '@nextui-org/react';
import { Badge, Grid } from '@nextui-org/react';

import {
  HiOutlineUserCircle,
  HiOutlineGlobeAlt,
  HiOutlineHeart,
  HiOutlineRectangleStack,
  HiRectangleStack,
} from 'react-icons/hi2';

const Layout = ({ children }) => {
  const { data: session } = useSession();

  const [visible, setVisible] = useState(false);
  const changeHandler = (next) => {
    setVisible(next);
  };

  const collections = [
    {
      id: 12312,
      name: 'collectionName',
      size: 7,
    },
    {
      id: 123312,
      name: 'collectionN',
      size: 9,
    },
  ];

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
              <div className={styles.collectionInfo}>
                <HiOutlineGlobeAlt className={styles.right} />
                <p className={styles.collectionName}>All</p>
              </div>
              <Badge isSquared color="primary" variant="bordered">
                1
              </Badge>
            </span>

            <span className={styles.collection}>
              <div className={styles.collectionInfo}>
                <HiOutlineHeart className={styles.right} />
                <p className={styles.collectionName}>Favourites</p>
              </div>
              <Badge isSquared color="primary" variant="bordered">
                43
              </Badge>
            </span>

            <p className={styles.subMenu}>collections</p>

            {collections.map((collection) => (
              <>
                <Link href={`/${collection.id}`}>
                  <a className={styles.collection}>
                    <div className={styles.collectionInfo}>
                      <HiOutlineRectangleStack className={styles.right} />

                      <p className={styles.collectionName}>{collection.name}</p>
                    </div>
                    <Badge isSquared color="primary" variant="bordered">
                      {collection.size}
                    </Badge>
                  </a>
                </Link>
              </>
            ))}
          </menu>
        </aside>
        <div className={styles.mainContent}>{children}</div>
      </div>
    </div>
  );
};

export default Layout;
