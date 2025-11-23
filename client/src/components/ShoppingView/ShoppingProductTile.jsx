import React, { useCallback } from 'react'
import { Card, CardContent, CardFooter } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { brandOptionsMap, categoryOptionsMap } from '@/config/registerFormControls'
import LazyImage from './LazyImage'

const ShoppingProductTile = ({product, handleGetProductDetails, handleAddToCart, index = 0}) => {
  // Memoize handlers to prevent unnecessary re-renders
  const handleClick = useCallback(() => {
    handleGetProductDetails(product?._id);
  }, [product?._id, handleGetProductDetails]);

  const handleCartClick = useCallback((e) => {
    e.stopPropagation(); // Prevent triggering product details
    handleAddToCart(product?._id, product?.totalStock);
  }, [product?._id, product?.totalStock, handleAddToCart]);

  // Priority loading for first 8 items (above the fold)
  const isPriority = index < 8;

  // Determine badge content
  const getBadgeContent = () => {
    if (product?.totalStock === 0) {
      return 'Out of Stock';
    } else if (product?.totalStock < 10) {
      return `only ${product?.totalStock} items left`;
    } else if (product?.salePrice > 0) {
      return 'Sale';
    }
    return null;
  };

  const badgeContent = getBadgeContent();

  return (
    <Card className={'w-full max-w-sm mx-auto p-0 pb-4 will-change-transform'}>
        <div 
          onClick={handleClick} 
          className='cursor-pointer hover:shadow-lg transition-shadow duration-300'
        >
            <div className="relative overflow-hidden">
                <LazyImage 
                    src={product?.image} 
                    alt={product?.title}
                    priority={isPriority}
                    className='w-full h-[300px] object-cover rounded-t-lg'
                />
                {badgeContent && (
                    <Badge className={'absolute top-2 left-2 bg-red-500 hover:bg-red-600 z-10'}>
                        {badgeContent}
                    </Badge>
                )}
            </div>

            <CardContent className={'p-4'}>
                <h2 className='text-xl font-bold mb-2 line-clamp-2'>{product?.title}</h2>
                <div className="flex justify-between items-center mb-2">
                    <span className='text-sm text-muted-foreground'>{categoryOptionsMap[product?.category]}</span>
                    <span className='text-sm text-muted-foreground'>{brandOptionsMap[product?.brand] || product?.brand}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                    <span
                        className={`${product?.salePrice > 0 ? 'line-through' : ""} text-lg font-semibold text-primary`}
                    >${product?.price}
                    </span>
                    {product?.salePrice > 0 && (
                        <span className='text-lg font-semibold text-primary'>
                            ${product?.salePrice}
                         </span>
                    )}
                </div>
            </CardContent>
        </div>

        <CardFooter>
            {product?.totalStock === 0 ? (
                <Button className={'w-full opacity-60 cursor-not-allowed'} disabled>
                    Out of Stock
                </Button>
            ): (
                <Button 
                onClick={handleCartClick}
                className={'w-full bg-primary hover:bg-primary/90 text-white'}>
                    Add to Cart
                </Button>
            )}
        </CardFooter>
    </Card>
  )
}

// Memoize component to prevent unnecessary re-renders
export default React.memo(ShoppingProductTile, (prevProps, nextProps) => {
  // Only re-render if product data actually changed
  return (
    prevProps.product?._id === nextProps.product?._id &&
    prevProps.product?.totalStock === nextProps.product?.totalStock &&
    prevProps.product?.salePrice === nextProps.product?.salePrice &&
    prevProps.product?.price === nextProps.product?.price
  );
})