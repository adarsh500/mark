import { Button } from '@/components/ui/button';
import { memo } from 'react';
import Image from 'next/image';
import styles from './Card.module.scss';
import {
  HiHeart,
  HiOutlineClipboardCopy,
  HiOutlineHeart,
  HiOutlineTrash,
} from 'react-icons/hi';
import { AiOutlineLink } from 'react-icons/ai';
import { useToast } from '@/components/ui/use-toast';

import { QueryClient } from '@tanstack/react-query';
import { extractSourceName } from '@/lib/utils';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
});

const Component = (props) => {
  const { toast } = useToast();
  const { _id, image, title, description, url, date, tags, favourite } = props;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    toast({ title: 'Copied to clipboard' });
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
      toast({ title: 'Deleted a bookmark' });
    } catch (e) {
      toast({ title: 'Something went wrong', variant: 'destructive' });
      console.log(e);
    }
  };

  const addToFavourite = async () => {
    try {
      await fetch(`api/bookmarks/${_id}`, {
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
        toast({ title: 'Added to favourites' });
      } else {
        toast({ title: 'Removed from favourites' });
      }
    } catch (e) {
      toast({ title: 'Something went wrong', variant: 'destructive' });
      console.log(e);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <Image
          className={styles.image}
          src={
            image ||
            'https://og-image.vercel.app/mark3.vercel.app.png?theme=dark&md=1&fontSize=100px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fvercel-triangle-white.svg'
          }
          layout="fill"
          placeholder="blur"
          blurDataURL="https://og-image.vercel.app/.png?theme=dark&md=1&fontSize=100px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-white-logo.svg"
          alt="Link og:image"
          objectFit="cover"
          loading="lazy"
        ></Image>

        <div className={styles.overlay}>
          <Button className={styles.button} onClick={deleteBookmark}>
            {<HiOutlineTrash className={styles.icons} />}
          </Button>

          <Button className={styles.button} onClick={addToFavourite}>
            {!favourite ? (
              <HiOutlineHeart className={styles.icons} />
            ) : (
              <HiHeart className={styles.icons} />
            )}
          </Button>

          <Button className={styles.button} onClick={copyToClipboard}>
            {<AiOutlineLink className={styles.icons} />}
          </Button>
        </div>
      </div>

      <div className={styles.subContent}>
        <a href={url} className={styles.title} target="_blank">
          {title}
        </a>
        <p className={styles.description}>{description}</p>

        <div className={styles.tags}>
          {/* {tags?.map((tag, index) => (
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
          ))} */}
        </div>

        <div className={styles.info}>
          {/* <p className={styles.site}>{extractSourceName(url)}</p> */}
          <p className={styles.date}>{date}</p>
        </div>
      </div>
    </div>
  );
};

const Card = memo(Component);
export default Card;
