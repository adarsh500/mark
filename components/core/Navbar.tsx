'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { createUrl } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useRef, useState } from 'react';
import { HiOutlineHashtag, HiOutlineMenuAlt2, HiSearch } from 'react-icons/hi';
import { MdClear } from 'react-icons/md';
import { Button } from '../ui/button';
import { MoonIcon, SunIcon } from '@radix-ui/react-icons';
import { useTheme } from 'next-themes';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const Navbar = () => {
  const router = useRouter();
  const { setTheme } = useTheme();
  const ref = useRef(null);
  const searchParams = useSearchParams();
  const [search, setSearch] = React.useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const actions = [
    {
      key: 'tag',
      label: 'Search by tags',
      icon: <HiOutlineHashtag className="w-4 h-4" />,
      action: () => {
        setSearch('tag:');
        ref.current.focus();
        setIsDropdownOpen(false);
      },
    },
    {
      key: 'raw',
      label: 'Search by title / description',
      icon: <HiOutlineMenuAlt2 className="w-4 h-4" />,
      action: () => {
        setSearch('raw:');
        ref.current.focus();
        setIsDropdownOpen(false);
      },
    },
  ];

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

  const handleSearch = (e) => {
    setSearch(e.target.value);

    setIsDropdownOpen(true);
  };

  return (
    <div className="border border-solid border-border px-4 py-4 border-l-0 flex items-center justify-between">
      <form
        onSubmit={onSubmit}
        className="w-max-[550px] relative w-full lg:w-80 xl:w-full"
      >
        <div className="flex gap-1">
          <Popover open={isDropdownOpen}>
            <PopoverTrigger>
              <div
                className="flex w-[350px] focus-visible:ring-1 focus-visible:ring-ring rounded-md border border-input"
                onClick={() => {
                  setIsDropdownOpen(true);
                  ref.current.focus();
                }}
              >
                <Input
                  className="border border-solid border-transparent shadow-none focus-visible:border-none focus-visible:outline-none focus-visible:shadow-none focus-visible:ring-0"
                  key={searchParams?.get('q')}
                  type="text"
                  name="search"
                  placeholder="Search for bookmarks"
                  value={search}
                  autoComplete="off"
                  ref={ref}
                  onChange={(e) => setSearch(e.target.value)}
                ></Input>
                {!!search.trim().length && (
                  <Button variant="ghost" size="icon" onClick={clearSearch}>
                    <MdClear />
                  </Button>
                )}
              </div>
            </PopoverTrigger>
            <PopoverContent className="flex flex-col justify-start w-[350px] p-2">
              <ul>
                {actions.map((action) => (
                  <li
                    key={action.key}
                    onClick={action.action}
                    className="flex items-center p-2 text-sm gap-2 hover:bg-primary-foreground"
                  >
                    {action.icon}
                    {action.label}
                  </li>
                ))}
              </ul>
            </PopoverContent>
          </Popover>

          <Button type="submit">
            <HiSearch className="h-[18px] w-[18px]" />
          </Button>
        </div>
      </form>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setTheme('light')}>
            Light
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme('dark')}>
            Dark
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Navbar;
