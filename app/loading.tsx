import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  <div className="flex flex-wrap">
    {[0, 1, 2, 3, 4, 5, 6, 7].map((_, index) => (
      <Skeleton
        className="border border-solid border-transparent rounded-md w-[calc(calc(100%-102px)/4)] max-w-full min-h-[290px] m-3 transition-all ease-linear"
        key={index}
      />
    ))}
  </div>;
}
