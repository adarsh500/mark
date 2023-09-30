'use client';
import Link from 'next/link';
import React from 'react';
import { usePathname } from 'next/navigation';


type CollectionProps = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

const Collection = (props: CollectionProps) => {
  const pathname = usePathname();
  console.log(pathname);
  const { label, href, icon } = props;

  return (
    <Link href={href} className="flex items-center gap-2 px-1 py-2 hover:bg-secondary">
      <div>{icon}</div>
      <p>{label}</p>
    </Link>
  );
};

export default Collection;
