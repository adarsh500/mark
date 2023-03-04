import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import styles from './CardLoader.module.scss';

const CardLoader = () => {
  return (
    <div className={styles.cardLoader}>
      <Skeleton count={1} height={160} width={350} enableAnimation />
      <Skeleton
        count={3}
        height={32}
        width={350}
        enableAnimation
        className={styles.content}
      />
    </div>
  );
};

export default CardLoader;
