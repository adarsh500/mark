import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth/next';
import Image from 'next/image';
import React, { Suspense } from 'react';
import { HiOutlineGlobeAlt } from 'react-icons/hi';
import { MdFavoriteBorder } from 'react-icons/md';
import { Button } from '../ui/button';
import Collection from './Collections/Collection';
import CollectionsList from './Collections/CollectionList';
import Navbar from './Navbar';
import { HiPlus } from 'react-icons/hi';

const BookmarksModal = dynamic(() => import('./Bookmarks/BookmarksModal'), {
  ssr: false,
});

import Loading from '@/app/loading';
import dynamic from 'next/dynamic';

type LayoutProps = {
  children: React.ReactNode;
};

type Session = {
  user: {
    image: string;
    name: string;
    id: string;
  };
};

const Layout = async (props: LayoutProps) => {
  const { children } = props;
  const session: Session = await getServerSession(authOptions);
  const { image = '', name = '', id = '' } = session?.user;

  return (
    <div className="w-full h-full flex flex-row">
      <aside className="min-w-[200px] w-[25%] max-w-[320px] dark:bg-background border border-solid border-border flex flex-col flex-shrink-0 overflow-hidden bg-secondary">
        <div className="flex gap-3 items-center mb-3 p-4 mt-2 flex-shrink-0">
          <Image
            className="rounded-full"
            src={session?.user.image as string}
            alt="Profile picture"
            width={32}
            height={32}
          />
          <b>{session?.user?.name}</b>
        </div>
        <div className="p-2 flex flex-col justify-between flex-1 overflow-hidden">
          <div className="flex flex-col overflow-scroll">
            <Collection label="Home" href="/" icon={<HiOutlineGlobeAlt />} />
            <Collection
              label="Favourites"
              href="/favourites"
              icon={<MdFavoriteBorder />}
            />

            <CollectionsList id={id} />
          </div>

          <BookmarksModal
            trigger={
              <Button className="w-full flex-shrink-0 mt-4 flex items-center gap-2 py-6">
                <div>
                  <HiPlus />
                </div>
                Add Bookmark
              </Button>
            }
            userId={id}
          />
        </div>
      </aside>
      <div className="w-full flex flex-col">
        <Navbar />
        <main className="p-6 flex-1 overflow-scroll">
          <Suspense fallback={<Loading />}>{children}</Suspense>
        </main>
      </div>
    </div>
  );
};

export default Layout;
