import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import Image from 'next/image';
import { memo } from 'react';
import { AiOutlineLink } from 'react-icons/ai';
import { HiHeart, HiOutlineHeart, HiOutlineTrash } from 'react-icons/hi';

import { extractSourceName } from '@/lib/utils';
import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
});

const Component = (props) => {
  const { toast } = useToast();
  const {
    _id,
    image,
    title,
    description,
    url,
    created_at,
    tags,
    favourite,
    provider,
    icon,
  } = props;

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
    <div className="border border-solid border-secondary rounded-md w-[calc(calc(100%-102px)/4)] max-w-full min-h-[300px] m-3 transition-all ease-linear bg-primary-foreground hover:scale-[101%]">
      <div className="relative h-[180px] w-full object-cover object-center">
        <Image
          className="rounded-t-md"
          src={
            image ??
            'https://og-image.vercel.app/mark3.vercel.app.png?theme=dark&md=1&fontSize=100px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fvercel-triangle-white.svg'
          }
          layout="fill"
          placeholder="blur"
          blurDataURL="https://og-image.vercel.app/.png?theme=dark&md=1&fontSize=100px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-white-logo.svg"
          alt="Link og:image"
          objectFit="cover"
          loading="lazy"
          onError={(e) => {}}
        />

        <div className="flex justify-end absolute top-0 bottom-0 left-0 right-0 h-full w-full opacity-0 transition ease-linear bg-[#434343a7]">
          <Button onClick={deleteBookmark}>
            {<HiOutlineTrash className="h-[18px] w-[18px]" />}
          </Button>

          <Button onClick={addToFavourite}>
            {!favourite ? (
              <HiOutlineHeart className="h-[18px] w-[18px]" />
            ) : (
              <HiHeart className="h-[18px] w-[18px]" />
            )}
          </Button>

          <Button onClick={copyToClipboard}>
            {<AiOutlineLink className="h-[18px] w-[18px]" />}
          </Button>
        </div>
      </div>

      <div className="min-h-[180px] flex flex-col justify-between py-4 px-3">
        <a
          href={url}
          className="justify-start items-start min-h-[30px] text-base line-clamp-1 font-medium"
          target="_blank"
        >
          {title}
        </a>
        <p className="my-2.5 items-center text-sm line-clamp-2">
          {description}
        </p>

        {/* <div className={styles.tags}> */}
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
        {/* </div> */}

        <div className="flex justify-between items-center">
          <p className="line-clamp-1 text-xs">
            {provider || extractSourceName(url)}
          </p>
          {/* <p>{created_at}</p> */}
        </div>
      </div>
    </div>
  );
};

const Card = memo(Component);
export default Card;
