'use client';
import React, { useState } from 'react';
import Image from "next/legacy/image";
import clsx from 'clsx';

const BlurImage = (props: any) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
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
  );
};

export default BlurImage;
