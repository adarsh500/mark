import User from '@components/User';
import { Button } from '@nextui-org/react';
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
