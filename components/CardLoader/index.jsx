import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import styles from './CardLoader.module.scss';

const CardLoader = (props) => {
  const { style } = props;
  return (
    <div style={style}>
      <Skeleton count={1} height={160} enableAnimation />
      <Skeleton
        count={4}
        height={36}
        enableAnimation
        className={styles.content}
      />
    </div>
  );
};

export default CardLoader;
