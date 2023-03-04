import User from '@components/User';

import { Button, Popover, Text } from '@nextui-org/react';
import { HiOutlineSearch } from 'react-icons/hi';
import { HiBars3, HiOutlinePlusCircle } from 'react-icons/hi2';
import styles from './Navbar.module.scss';

const Navbar = (props) => {
  const { handler, closeHandler, query, setQuery, expanded, setExpanded } =
    props;

  return (
    <nav className={styles.navbar}>
      <div className={styles.main}>
        <Button
          icon={<HiBars3 />}
          auto
          flat
          className={styles.hamburgerIconMobile}
          onClick={(e) => setExpanded(!expanded)}
        ></Button>
        <div className={styles.userMobile}>
          <User />
        </div>
      </div>
      <div className={styles.searchContainer}>
        <div className={styles.search}>
          <HiOutlineSearch className={styles.right} />
          <input
            // fullWidth
            // size="xl"
            placeholder="Search query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={styles.searchBox}
          />
        </div>
        <Popover isBordered disableShadow>
          <Popover.Trigger>
            <Button auto flat color="">
              info
            </Button>
          </Popover.Trigger>
          <Popover.Content>
            <Text css={{ p: '$6 ' }}>
              use {"'"}tag-{'{'}query{'}'}
              {"'"} to search by tag
            </Text>
            <Text css={{ p: '$6' }}>
              use {"'"}title-{'{'}query{'}'}
              {"'"} to search by title
            </Text>
            <Text css={{ p: '$6' }}>
              use {"'"}dsc-{'{'}query{'}'}
              {"'"} to search by description
            </Text>
          </Popover.Content>
        </Popover>
      </div>

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
