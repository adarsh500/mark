import React from 'react';
import { Input } from '@/components/ui/input';

const Navbar = () => {
  return (
    <div className="border border-solid border-border px-4 py-4 border-l-0">
      <div className="w-80">
        <Input placeholder="Search for bookmarks" />
      </div>
    </div>
  );
};

export default Navbar;
