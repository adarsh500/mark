'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { createUrl } from '@/lib/utils';
import { MoonIcon, SunIcon } from '@radix-ui/react-icons';
import { useTheme } from 'next-themes';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { MutableRefObject, useRef, useState } from 'react';
import { HiOutlineHashtag, HiOutlineMenuAlt2, HiSearch } from 'react-icons/hi';
import { IoShareOutline } from 'react-icons/io5';
import { Button } from '../ui/button';
import { CiImport } from 'react-icons/ci';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const Navbar = () => {
  const router = useRouter();
  const pathName = usePathname();
  const { setTheme } = useTheme();
  const ref = useRef() as MutableRefObject<HTMLInputElement>;
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

    if (search) {
      newParams.set('q', search.value);
    } else {
      newParams.delete('q');
    }

    router.push(createUrl(pathName as string, newParams));
  }

  // const clearSearch = () => {
  //   setSearch('');
  //   const newParams = new URLSearchParams(searchParams.toString());
  //   newParams.delete('q');
  //   router.push('/');
  // };

  return (
    <div className="border border-solid border-border px-4 py-4 border-l-0 flex items-center justify-between dark:bg-background bg-white ">
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
                  onChange={(e) => {
                    setIsDropdownOpen(false);
                    setSearch(e.target.value);
                  }}
                />
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

      <div className="flex justify-end gap-4">
        {/* <Button variant="secondary" className="flex items-center gap-2">
          <IoShareOutline />
          <p className="text-xs font-normal">Share</p>
        </Button>

        <Button variant="secondary" className="flex items-center gap-2">
          <CiImport />
          <p className="text-xs font-normal w-min">Import</p>
        </Button> */}

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
    </div>
  );
};

export default Navbar;
