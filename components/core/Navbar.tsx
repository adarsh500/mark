'use client';
import { Input } from '@/components/ui/input';
import { createUrl } from '@/lib/utils';
import {
  useRouter,
  useSearchParams
} from 'next/navigation';
import React from 'react';
import { HiSearch } from 'react-icons/hi';
import { MdClear } from 'react-icons/md';
import { Button } from '../ui/button';

const Navbar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = React.useState('');
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const val = e.target as HTMLFormElement;
    const search = val.search as HTMLInputElement;

    const newParams = new URLSearchParams(searchParams.toString());

    console.log('search', search.value);
    if (search) {
      newParams.set('q', search.value);
    } else {
      newParams.delete('q');
    }

    router.push(createUrl('', newParams));
  }

  const clearSearch = () => {
    setSearch('');
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete('q');
    console.log('first', newParams.toString());
    router.push('/');
  };

  return (
    <div className="border border-solid border-border px-4 py-4 border-l-0">
      <form
        onSubmit={onSubmit}
        className="w-max-[550px] relative w-full lg:w-80 xl:w-full"
      >
        <div className="flex gap-1">
          <div className="flex w-[350px] focus-visible:ring-1 focus-visible:ring-ring rounded-md border border-input">
            <Input
              className="border border-solid border-transparent shadow-none focus-visible:border-none focus-visible:outline-none focus-visible:shadow-none focus-visible:ring-0"
              key={searchParams?.get('q')}
              type="text"
              name="search"
              placeholder="Search for bookmarks"
              value={search}
              autoComplete="off"
              // defaultValue={searchParams?.get('q') || ''}
              onChange={(e) => setSearch(e.target.value)}
            ></Input>
            <Button variant="ghost" size="icon" onClick={clearSearch}>
              <MdClear />
            </Button>
          </div>

          <Button type="submit">
            <HiSearch className="h-[18px] w-[18px]" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Navbar;
