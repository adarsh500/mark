import React, { useState } from 'react';
import styles from './Navbar.module.scss';
import { Button, Text } from '@nextui-org/react';
import { HiOutlinePlusCircle } from 'react-icons/hi2';

const Navbar = (props) => {
  // const [query, setQuery] = useState();
  const { handler, closeHandler, query, setQuery } = props;

  return (
    <nav className={styles.navbar}>
      <Text h2>Mark3</Text>

      <div className={styles.right}>
        <div className={styles.share}>
          <Button color="primary" auto flat>
            Share
          </Button>
        </div>
        <div className={styles.new}>
          <Button
            color="primary"
            auto
            flat
            onClick={handler}
            iconRight={<HiOutlinePlusCircle />}
          >
            Create bookmark
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
