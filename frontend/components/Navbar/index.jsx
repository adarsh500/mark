import React, { useState } from 'react';
import styles from './Navbar.module.scss';
import { Button } from '@nextui-org/react';
import { Input, Spacer } from '@nextui-org/react';
import { HiOutlineSearch } from 'react-icons/hi';

const Navbar = () => {
  const [query, setQuery] = useState();

  return (
    <nav className={styles.navbar}>
      <div className={styles.search}>
        <HiOutlineSearch className={styles.right} />
        <Input size="xl" placeholder="Search" />
      </div>

      <div className={styles.right}>
        <div className={styles.share}>
          <Button color="primary" auto flat>
            Share
          </Button>
        </div>
        <div className={styles.new}>
          <Button color="primary" auto flat>
            Add new
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
