import { Button, Dropdown } from '@nextui-org/react';
import { signOut } from 'next-auth/react';
import { HiOutlineUserCircle } from 'react-icons/hi2';
import styles from './User.module.scss';

const User = (props) => {
  const { expanded, userName } = props;

  return (
    <Dropdown color={'default'} className={styles.dropdown}>
      <Dropdown.Button
        flat
        className={
          expanded ? styles.dropdownButton : styles.dropdownButtonMinimized
        }
      >
        {expanded ? (
          <span className={expanded ? styles.user : styles.userHidden}>
            <>
              <HiOutlineUserCircle className={styles.right} />
              <p>{userName ? userName : ''}</p>
            </>
          </span>
        ) : null}
      </Dropdown.Button>
      <Dropdown.Menu className={styles.dropdownMenu}>
        <Dropdown.Item className={styles.dropdownItem}>
          <Button
            color="error"
            auto
            flat
            onClick={() => signOut()}
            className={styles.button}
          >
            Sign out
          </Button>
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default User;
