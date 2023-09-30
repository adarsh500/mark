'use client';
import { PiXCircle } from 'react-icons/pi';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { HiOutlineDotsHorizontal, HiPlus } from 'react-icons/hi';

type CollectionProps = {
  id?: string;
  label: string;
  href: string;
  icon?: React.ReactNode;
  hasActions?: boolean;
  deleteCollection?: (e: any, id: string) => void;
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
  } = props;

  return (
    <div
      className={clsx(
        'flex items-center px-3 py-2 hover:bg-secondary rounded-md select-none justify-between',
        { 'bg-secondary': pathname === href }
      )}
    >
      <div className="flex items-center gap-2">
        {icon}
        <Link href={href}>{label}</Link>
      </div>
      {hasActions && (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <HiOutlineDotsHorizontal />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem className="flex items-center gap-2">
              <HiPlus />
              Create Collection
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center gap-2"
              onClick={(e) => deleteCollection(e, id)}
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

export default Collection;
