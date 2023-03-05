import User from '@components/User';
import { Button } from '@nextui-org/react';
import { useEffect, useRef, useState } from 'react';
import {
  HiHeart,
  HiOutlineHashtag,
  HiOutlineLink,
  HiOutlineMenuAlt2,
  HiOutlineSearch,
} from 'react-icons/hi';

import { HiBars3, HiOutlinePlusCircle } from 'react-icons/hi2';
import styles from './Navbar.module.scss';

const Navbar = (props) => {
  const ref = useRef();
  const [hasFocus, setFocus] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { handler, closeHandler, query, setQuery, expanded, setExpanded } =
    props;

  const myFunction = () => {
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const keyDownHandler = (event) => {
      console.log('User pressed: ', event.key);

      if (event.key === 'Escape') {
        event.preventDefault();
        myFunction();
      }
    };

    document.addEventListener('keydown', keyDownHandler);

    return () => {
      document.removeEventListener('keydown', keyDownHandler);
    };
  }, []);

  const actions = [
    {
      key: 'fav',
      label: 'Search in favourites',
      icon: <HiHeart className={styles.right} />,
      action: () => {
        setQuery('fav:');
        ref.current.focus();
        setIsDropdownOpen(false);
      },
    },
    {
      key: 'tag',
      label: 'Search by tags',
      icon: <HiOutlineHashtag className={styles.right} />,
      action: () => {
        setQuery('tag:');
        ref.current.focus();
        setIsDropdownOpen(false);
      },
    },
    {
      key: 'url',
      label: 'Search in URLs',
      icon: <HiOutlineLink className={styles.right} />,
      action: () => {
        setQuery('url:');
        ref.current.focus();
        setIsDropdownOpen(false);
      },
    },
    {
      key: 'raw',
      label: 'Search in title / description',
      icon: <HiOutlineMenuAlt2 className={styles.right} />,
      action: () => {
        setQuery('raw:');
        ref.current.focus();
        setIsDropdownOpen(false);
      },
    },
  ];

  useEffect(() => {
    if (document.hasFocus() && ref.current.contains(document.activeElement)) {
      setFocus(true);
    }
  }, []);

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
          <HiOutlineSearch className={styles.searchIcon} />
          <input
            ref={ref}
            onFocus={() => {
              setFocus(true);
              setIsDropdownOpen(true);
            }}
            onBlur={() => setFocus(false)}
            placeholder="Search query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={styles.searchBox}
          />
        </div>
        {isDropdownOpen ? (
          <div className={styles.searchDropdown}>
            <ul>
              {actions.map((action) => (
                <li
                  key={action.key}
                  className={styles.searchDropdownItem}
                  onClick={action.action}
                >
                  {action.icon}
                  {action.label}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      <div className={styles.right}>
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
