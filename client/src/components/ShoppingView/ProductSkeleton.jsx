import React from 'react';
import { Card, CardContent, CardFooter } from '../ui/card';
import { Skeleton } from '../ui/skeleton';

const ProductSkeleton = () => {
  return (
    <Card className="w-full max-w-sm mx-auto p-0 pb-4">
      <div className="relative">
        <Skeleton className="w-full h-[300px] rounded-t-lg" />
      </div>
      <CardContent className="p-4">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <div className="flex justify-between items-center mb-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-5 w-24 mb-2" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
};

export default ProductSkeleton;

