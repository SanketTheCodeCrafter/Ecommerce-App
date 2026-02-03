import React from 'react'
import { Card, CardContent, CardFooter } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { brandOptionsMap, categoryOptionsMap } from '@/config/registerFormControls'
import LazyImage from '../CommonCompo/LazyImage'

const ShoppingProductTile = React.memo(({ product, handleGetProductDetails, handleAddToCart }) => {
    const handleClick = React.useCallback(() => {
        if (product?._id) {
            handleGetProductDetails(product._id);
        }
    }, [product?._id, handleGetProductDetails]);

    const handleAddToCartClick = React.useCallback(() => {
        if (product?._id && product?.totalStock) {
            handleAddToCart(product._id, product.totalStock);
        }
    }, [product?._id, product?.totalStock, handleAddToCart]);

    return (
        <Card className={'w-full max-w-sm mx-auto p-0 pb-4'}>
            <div onClick={handleClick} className='cursor-pointer hover:shadow-lg transition-shadow duration-300'>
                <div className="relative bg-gray-50">
                    <LazyImage
                        src={product?.image}
                        alt={product?.title || 'Product image'}
                        className='w-full h-[300px] object-contain rounded-t-lg'
                        loading="lazy"
                        decoding="async"
                    />
                    {product?.totalStock === 0 ? (
                        <Badge className={'absolute top-2 left-2 bg-red-500 hover:bg-red-600'}>
                            Out of Stock
                        </Badge>
                    ) : product?.totalStock < 10 ? (
                        <Badge className={'absolute top-2 left-2 bg-red-500 hover:bg-red-600'}>
                            {`only ${product?.totalStock} items left`}
                        </Badge>
                    ) : product?.salePrice > 0 ? (
                        <Badge className={'absolute top-2 left-2 bg-red-500 hover:bg-red-600'}>
                            Sale
                        </Badge>
                    ) : null}
                </div>

                <CardContent className={'p-4'}>
                    <h2 className='text-xl font-bold mb-2'>{product?.title}</h2>
                    <div className="flex justify-between items-center mb-2">
                        <span className='text-sm text-muted-foreground'>{categoryOptionsMap[product?.category]}</span>
                        {/* {console.log('Brand value:', product?.brand)} */}
                        <span className='text-sm text-muted-foreground'>{brandOptionsMap[product?.brand] || product?.brand}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                        <span
                            className={`${product?.salePrice > 0 ? 'line-through' : ""} text-lg font-semibold text-primary`}
                        >${product?.price}
                        </span>
                        {product?.salePrice > 0 ? (
                            <span className='text-lg font-semibold text-primary'>
                                ${product?.salePrice}
                            </span>
                        ) : null}
                    </div>
                </CardContent>
            </div>

            <CardFooter>
                {product?.totalStock === 0 ? (
                    <Button className={'w-full opacity-60 cursor-not-allowed'} >
                        Out of Stock
                    </Button>
                ) : (
                    <Button
                        onClick={handleAddToCartClick}
                        className={'w-full bg-primary hover:bg-primary/90 text-white'}>
                        Add to Cart
                    </Button>
                )}
            </CardFooter>
        </Card>
    )
}, (prevProps, nextProps) => {
    // Custom comparison function for React.memo
    return (
        prevProps.product?._id === nextProps.product?._id &&
        prevProps.product?.image === nextProps.product?.image &&
        prevProps.product?.title === nextProps.product?.title &&
        prevProps.product?.price === nextProps.product?.price &&
        prevProps.product?.salePrice === nextProps.product?.salePrice &&
        prevProps.product?.totalStock === nextProps.product?.totalStock &&
        prevProps.product?.category === nextProps.product?.category &&
        prevProps.product?.brand === nextProps.product?.brand
    );
});

ShoppingProductTile.displayName = 'ShoppingProductTile';

export default ShoppingProductTile