import { Dropdown } from '@nextui-org/react';
import { HiOutlineUserCircle } from 'react-icons/hi2';
import { signOut } from 'next-auth/react';
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
          <span className={expanded ? styles.user: styles.userHidden}>
            <>
              <HiOutlineUserCircle className={styles.right} />
              <p>{userName}</p>
            </>
          </span>
        ) : null}
      </Dropdown.Button>
      <Dropdown.Menu>
        <Dropdown.Item
          key="delete"
          color="error"
          auto
          flat
          onClick={() => signOut()}
        >
          Sign Out
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default User;
