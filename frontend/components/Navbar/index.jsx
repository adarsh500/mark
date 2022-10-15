import React, { useState } from 'react';
import styles from './Navbar.module.scss';
import { Button, Text } from '@nextui-org/react';
import { Input, Spacer } from '@nextui-org/react';
import { HiOutlineSearch } from 'react-icons/hi';

const Navbar = (props) => {
  // const [query, setQuery] = useState();
  const { handler, closeHandler, query, setQuery } = props;

  return (
    <nav className={styles.navbar}>
      <Text h2>mark3</Text>

      <div className={styles.right}>
        <div className={styles.share}>
          <Button color="primary" auto flat>
            Share
          </Button>
        </div>
        <div className={styles.new}>
          <Button color="primary" auto flat onClick={handler}>
            Add new
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
