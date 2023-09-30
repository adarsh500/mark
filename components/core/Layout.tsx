import React from 'react';
import Navbar from './Navbar';
import Collection from './Collection';
import { HiOutlineGlobeAlt } from 'react-icons/hi';
import { MdFavoriteBorder } from 'react-icons/md';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = (props: LayoutProps) => {
  const { children } = props;

  return (
    <div className="w-full flex flex-row min-h-screen">
      <aside className="w-[25%] dark:bg-background border border-solid border-border">
        <Collection label="Home" href="/" icon={<HiOutlineGlobeAlt />} />
        <Collection
          label="Favourites"
          href="/favourites"
          icon={<MdFavoriteBorder />}
        />
      </aside>
      <div className="w-full">
        <Navbar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
