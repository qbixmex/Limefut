'use client';
import type { FC } from 'react';

export const LatestImages: FC = () => {
  return (
    <>
      <h2 className="text-emerald-500 text-2xl font-semibold mb-4">
        Imágenes Recientes
      </h2>
      <div className="grid grid-cols-2 gap-4 animate-pulse">
        <div className="bg-gray-800 w-full h-18 rounded" />
        <div className="bg-gray-800 w-full h-18 rounded" />
        <div className="bg-gray-800 w-full h-18 rounded" />
        <div className="bg-gray-800 w-full h-18 rounded" />
      </div>
    </>
  );
};

export default LatestImages;
