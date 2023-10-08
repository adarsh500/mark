import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const extractSourceName = (source: string): string => {
  const sourceArr = source.slice(8).split('.');
  const sourceName = sourceArr[0] + '.' + sourceArr[1];
  return sourceName;
};

export { extractSourceName };
