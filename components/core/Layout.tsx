import React from 'react';
import Navbar from './Navbar';
import Collection from './Collection';
import { HiOutlineGlobeAlt } from 'react-icons/hi';
import { MdFavoriteBorder } from 'react-icons/md';
import { authOptions } from '@/app/api/[...nextauth]/route';
import { getServerSession } from 'next-auth/next';
import Image from 'next/image';
import { Button } from '../ui/button';
import CollectionTree from './CollectionTree';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = async (props: LayoutProps) => {
  const { children } = props;
  const session = await getServerSession(authOptions);

  return (
    <div className="w-full flex flex-row flex-1">
      <aside className="min-w-[200px] w-[25%] dark:bg-background border border-solid border-border flex flex-col">
        <div className="flex gap-3 items-center mb-3 p-4 mt-2">
          <Image
            className="rounded-full"
            src={session?.user.image as string}
            alt="Profile picture"
            width={32}
            height={32}
          />
          <b>{session?.user?.name}</b>
        </div>
        <div className="p-2 flex flex-col justify-between flex-1">
          <div>
            <div>
              <Collection label="Home" href="/" icon={<HiOutlineGlobeAlt />} />
              <Collection
                label="Favourites"
                href="/favourites"
                icon={<MdFavoriteBorder />}
              />
            </div>
            <div className="mt-6">
              <b>Collections</b>
              <div>
                <CollectionTree />
              </div>
            </div>
          </div>

          <Button variant="outline" className="w-full">
            Add Bookmark
          </Button>
        </div>
      </aside>
      <div className="w-full">
        <Navbar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
