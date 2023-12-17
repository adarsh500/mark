'use client';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import clsx from 'clsx';
import Image from 'next/image';
import { useState } from 'react';

const BlurImage = (props: any) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <AspectRatio ratio={16 / 9} className="bg-muted">
      <Image
        {...props}
        alt={props.alt}
        className={clsx(
          props.className,
          'duration-700 ease-in-out rounded-lg mobile:rounded-md',
          isLoading
            ? 'grayscale blur-xl scale-105'
            : 'grayscale-0 blur-0 scale-100'
        )}
        onLoadingComplete={() => setIsLoading(false)}
      />
    </AspectRatio>
  );
};

export default BlurImage;
