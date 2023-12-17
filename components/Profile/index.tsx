'use client';
import React from 'react';
import Image from 'next/legacy/image';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LuUser2 } from 'react-icons/lu';
import { MdOutlinePayment } from 'react-icons/md';
import { IoPeopleOutline } from 'react-icons/io5';
import { TbLogout2 } from 'react-icons/tb';
import { signOut } from 'next-auth/react';

const Profile = (props) => {
  const { user } = props;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="flex gap-3 items-center">
          <Image
            className="rounded-full"
            src={user.image as string}
            alt="Profile picture"
            width={32}
            height={32}
          />
          <b className="line-clamp-1">{user?.name}</b>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[200px] mt-4 p-2">
        <DropdownMenuItem className="p-2 gap-3 m-0.5 cursor-pointer">
          <LuUser2 />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem className="p-2 gap-3 m-0.5 cursor-pointer">
          <MdOutlinePayment />
          Billing
        </DropdownMenuItem>
        <DropdownMenuItem className="p-2 gap-3 m-0.5 cursor-pointer">
          <IoPeopleOutline />
          Team
        </DropdownMenuItem>
        <DropdownMenuItem
          className="p-2 gap-3 m-0.5 cursor-pointer"
          onClick={() => signOut()}
        >
          <TbLogout2 />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Profile;
