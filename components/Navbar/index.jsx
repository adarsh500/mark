import User from '@components/User';
import { useRef, useState, useEffect } from 'react';
import { Button, Popover, Text } from '@nextui-org/react';
import { HiOutlineSearch } from 'react-icons/hi';
import { HiBars3, HiOutlinePlusCircle } from 'react-icons/hi2';
import styles from './Navbar.module.scss';

const Navbar = (props) => {
  const ref = useRef();
  const [hasFocus, setFocus] = useState(false);

  const { handler, closeHandler, query, setQuery, expanded, setExpanded } =
    props;

  // const cmdk = (e) => {
  //   if (e.keyCode === 75 && e.metaKey) {
  //     console.log('search');
  //   }
  // };

  const onKeyPress = (event) => {
    console.log(`key pressed: ${event.key}`);
  };

   useEffect(() => {
     if (document.hasFocus() && ref.current.contains(document.activeElement)) {
       setFocus(true);
     }
   }, []);
  // useKeyPress(['k'], onKeyPress);

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
        {/* <Dropdown
        className={styles.dropdown}
        >
          <Dropdown.Trigger> */}
        <div className={styles.search}>
          <HiOutlineSearch className={styles.right} />
          <input
            // fullWidth
            // size="xl"
            // onKeyDown={cmdk}
            ref={ref}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            placeholder="Search query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={styles.searchBox}
          />
        </div>
        {/* </Dropdown.Trigger>

          <Dropdown.Menu aria-label="Static Actions" className={styles.dropdownContent}>
            <Dropdown.Item key="new">New file</Dropdown.Item>
            <Dropdown.Item key="copy">Copy link</Dropdown.Item>
            <Dropdown.Item key="edit">Edit file</Dropdown.Item>
            <Dropdown.Item key="delete" color="error">
              Delete file
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown> */}

        <Popover isBordered shouldCloseOnBlur>
          <Popover.Trigger>
            <Button auto flat color="">
              info
            </Button>
          </Popover.Trigger>
          <Popover.Content css={{ w: '200px' }}>
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
        {/* <div className={styles.share}>
          <Button color="primary" auto flat>
            Share
          </Button>
        </div> */}
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
