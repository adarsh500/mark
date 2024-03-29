'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { memo } from 'react';
import { HiOutlineDotsHorizontal, HiPlus } from 'react-icons/hi';
import { PiXCircle } from 'react-icons/pi';

type CollectionProps = {
  id?: string;
  label: string;
  href: string;
  icon?: React.ReactNode;
  hasActions?: boolean;
  deleteCollection?: (e: any, id: string) => void;
  createCollection?: (e: any, id: string) => void;
};

const Collection = (props: CollectionProps) => {
  const pathname = usePathname();

  const {
    id = '',
    label = '',
    href = '',
    icon = null,
    hasActions = false,
    deleteCollection = () => {},
    createCollection = () => {},
  } = props;

  return (
    <div
      className={clsx(
        'flex items-center p-2 hover:bg-primary hover:text-secondary dark:hover:bg-secondary dark:hover:text-primary rounded-md select-none justify-between mb-1 transition-all ease-linear duration-200 cursor-pointer active:bg-primary text-sm active:text-primary-foreground',
        { 'bg-primary text-secondary': pathname === href }
      )}
    >
      <div
        className={clsx(
          'flex items-center gap-2 w-full transition-all ease-linear duration-100',
          {
            'ml-1': pathname === href,
          }
        )}
      >
        {icon}
        <Link href={href} className="w-full">
          {label}
        </Link>
      </div>
      {hasActions && (
        <DropdownMenu>
          <DropdownMenuTrigger className="p-1">
            <HiOutlineDotsHorizontal />
          </DropdownMenuTrigger>
          <DropdownMenuContent hideWhenDetached>
            <DropdownMenuItem
              className="flex items-center gap-2"
              onSelect={(e) => createCollection(null, id)}
            >
              <HiPlus />
              Create Collection
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center gap-2"
              onSelect={(e) => deleteCollection(e, id)}
            >
              <PiXCircle />
              Delete Collection
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default memo(Collection);
