import { Badge, Button, Text } from '@nextui-org/react';
import { memo } from 'react';
import Image from 'next/image';
import styles from './Card.module.scss';

import {
  HiHeart,
  HiOutlineClipboardCopy,
  HiOutlineHeart,
  HiOutlineTrash,
} from 'react-icons/hi';
import { toast } from 'sonner';

import { QueryClient } from 'react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
});

const Component = (props) => {
  const { _id, image, title, description, url, date, tags, favourite } = props;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    toast.success('Copied to clipboard');
  };

  const deleteBookmark = async () => {
    try {
      const res = await fetch(`api/bookmarks/${_id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      await queryClient.refetchQueries({
        queryKey: ['bookmarks'],
      });
      toast.error('Deleted a bookmark');
    } catch (e) {
      toast.error('Something went wrong');
      console.log(e);
    }
  };

  const addToFavourite = async () => {
    try {
      const res = await fetch(`api/bookmarks/${_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          favourite: !favourite,
        }),
      });
      await queryClient.refetchQueries({
        queryKey: ['bookmarks'],
        type: 'active',
      });
      if (!favourite) {
        toast.success('Added to favourites');
      } else {
        toast('Removed from favourites');
      }
    } catch (e) {
      toast.error('Something went wrong');
      console.log(e);
    }
  };

  return (
    // <Link href={`/abc`}>
    <div className={styles.card}>
      <Image
        className={styles.image}
        src={
          image ||
          'https://og-image.vercel.app/mark3.vercel.app.png?theme=dark&md=1&fontSize=100px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fvercel-triangle-white.svg'
        }
        width={250}
        height={150}
        placeholder="blur"
        blurDataURL="https://og-image.vercel.app/.png?theme=dark&md=1&fontSize=100px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-white-logo.svg"
        layout="responsive"
        alt="Link og:image"
        objectFit="cover"
        loading="lazy"
      ></Image>

      <div className={styles.subContent}>
        <p className={styles.title}>{title}</p>
        <Text size={14} className={styles.description}>
          {description}
        </Text>

        <div className={styles.tags}>
          {tags?.map((tag, index) => (
            <Badge
              isSquared
              className={styles.badge}
              color="warning"
              variant="flat"
              key={index}
              disableOutline
            >
              # {tag}
            </Badge>
          ))}
        </div>

        <div className={styles.info}>
          {favourite && <HiHeart className={styles.fav} />}
          <p className={styles.site}>
            {url.length > 22 ? url.slice(0, 22) + '...' : url}
          </p>
          <p className={styles.date}>{date}</p>
        </div>
      </div>

      <div className={styles.overlay}>
        <Button
          auto
          className={styles.button}
          // size="xs"
          flat
          color="error"
          onClick={deleteBookmark}
          icon={<HiOutlineTrash className={styles.icons} />}
        ></Button>

        <Button
          auto
          className={styles.button}
          // size="xs"
          flat
          color="error"
          onClick={addToFavourite}
          icon={
            !favourite ? (
              <HiOutlineHeart className={styles.icons} />
            ) : (
              <HiHeart className={styles.icons} />
            )
          }
        ></Button>

        <Button
          auto
          className={styles.button}
          // size="xs"
          flat
          onClick={copyToClipboard}
          icon={<HiOutlineClipboardCopy className={styles.icons} />}
        ></Button>
      </div>
    </div>
    // </Link>
  );
};

const Card = memo(Component);
export default Card;
