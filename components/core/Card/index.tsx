'use client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import Image from 'next/legacy/image';
import { memo } from 'react';
import { AiOutlineLink } from 'react-icons/ai';
import { HiHeart, HiOutlineHeart, HiOutlineTrash } from 'react-icons/hi';

import { extractSourceName } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import BlurImage from '@/components/BlurImage';

const Component = (props) => {
  const queryClient = useQueryClient();

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
    user_id,
  } = props;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    toast({ title: 'Copied to clipboard' });
  };

  const deleteBookmarkHandler = async () => {
    try {
      await deleteBookmark({ _id });
      await queryClient.refetchQueries({
        queryKey: ['bookmarks'],
      });
      toast({ title: 'Deleted a bookmark' });
    } catch (e) {
      toast({ title: 'Something went wrong', variant: 'destructive' });
      console.log(e);
    }
  };

  const { mutateAsync: deleteBookmark } = useMutation(
    async (inputs: any) => {
      const { _id } = inputs;
      try {
        const res = await fetch(`/api/bookmarks/${_id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        });
        if (res.ok) {
          return res.json();
        } else {
          throw new Error();
        }
      } catch (e) {
        toast({ title: 'Something went wrong', variant: 'destructive' });
        console.log(e);
      }
    },
    {
      onSuccess: () => {
        queryClient.refetchQueries({
          queryKey: ['bookmarks'],
        });
        toast({ title: 'Deleted a bookmark' });
      },
      onError: (e) => {
        toast({ title: 'Something went wrong', variant: 'destructive' });
        console.log(e);
      },
    }
  );

  const { mutateAsync } = useMutation(async (inputs: any) => {
    try {
      const data = await fetch(`/api/bookmarks/${_id}`, {
        method: 'PUT',
        body: JSON.stringify({
          ...inputs,
        }),
      });
      if (data.ok) {
        return data.json();
      } else {
        throw new Error();
      }
    } catch (err) {
      throw err.response;
    }
  });

  const addToFavourite = async () => {
    try {
      await mutateAsync({ user_id, favourite: !favourite });
      await queryClient.refetchQueries({
        queryKey: ['bookmarks'],
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
    <div className="border border-solid border-secondary rounded-md w-[calc(calc(100%-102px)/4)] max-w-full min-h-[290px] m-3 transition-all ease-linear bg-primary-foreground hover:scale-[101%]">
      <div className="group relative h-[180px] w-full object-cover object-center">
        <BlurImage
          className="rounded-t-md rounded-b-none"
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
          onError={(e) => {
            console.error('failed to fetch image', e);
          }}
        />

        <div className="flex justify-end gap-2 p-2 absolute top-0 bottom-0 left-0 right-0 h-full w-full opacity-0 transition ease-linear bg-[#434343a7] group-hover:opacity-100">
          <Button onClick={deleteBookmarkHandler} variant="secondary" size="sm">
            {<HiOutlineTrash className="h-[18px] w-[18px]" />}
          </Button>

          <Button onClick={addToFavourite} variant="secondary" size="sm">
            {!favourite ? (
              <HiOutlineHeart className="h-[18px] w-[18px]" />
            ) : (
              <HiHeart className="h-[18px] w-[18px]" />
            )}
          </Button>

          <Button onClick={copyToClipboard} variant="secondary" size="sm">
            {<AiOutlineLink className="h-[18px] w-[18px]" />}
          </Button>
        </div>
      </div>

      <div className="min-h-[180px] flex flex-col justify-between py-4 px-3">
        <div>
          <div className="flex items-center justify-start gap-2">
            <a
              href={url}
              className="justify-start items-start text-sm line-clamp-1 font-medium"
              target="_blank"
            >
              {title}
            </a>
          </div>

          <p className="my-2 items-center text-xs line-clamp-2">
            {description}
          </p>
        </div>

        {!!tags?.length && (
          <div className="flex flex-wrap gap-2 mb-0.5">
            {tags.map((tag, index) => (
              <Badge key={index} className="gap-1 py-0.5 px-1">
                <p className="text-2xs font-light">{tag}</p>
              </Badge>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center">
          <div className="flex justify-start gap-1.5 items-center">
            {!!icon && (
              <Image
                src={icon}
                width={18}
                height={18}
                alt="Link icon"
                className="bg-gray-200 dark:bg-gray-700 p-0.5 rounded-sm"
              />
            )}
            <p className="line-clamp-1 text-xs max-w-[80%]">
              {provider || extractSourceName(url)}
            </p>
          </div>
          {/* <p className="line-clamp-1 text-xs">{created_at}</p> */}
        </div>
      </div>
    </div>
  );
};

const Card = memo(Component);
export default Card;
