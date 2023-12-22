'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { signOut } from 'next-auth/react';
import Image from 'next/legacy/image';
import { IoPeopleOutline } from 'react-icons/io5';
import { LuUser2 } from 'react-icons/lu';
import { MdOutlinePayment } from 'react-icons/md';
import { TbLogout2 } from 'react-icons/tb';

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
      <DropdownMenuContent className="min-w-[200px] mt-2 p-2 ml-4">
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
