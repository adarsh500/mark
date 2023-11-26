'use client';
import React from 'react';
import Image from 'next/image';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const Profile = (props) => {
  const { user } = props;
  return (
    <Popover>
      <PopoverTrigger>
        <div className="flex gap-3 items-center mb-3 p-4 mt-2 flex-shrink-0">
          <Image
            className="rounded-full"
            src={user.image as string}
            alt="Profile picture"
            width={32}
            height={32}
          />
          <b>{user?.name}</b>
        </div>
      </PopoverTrigger>
      <PopoverContent sideOffset={-10}></PopoverContent>
    </Popover>
  );
};

export default Profile;
