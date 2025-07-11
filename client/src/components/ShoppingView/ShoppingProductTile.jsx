import React from 'react'
import { Card, CardContent, CardFooter } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { brandOptionsMap, categoryOptionsMap } from '@/config/registerFormControls'

const ShoppingProductTile = ({product, handleGetProductDetails, handleAddToCart}) => {
  return (
    <Card className={'w-full max-w-sm mx-auto p-0 pb-4'}>
        <div onClick={() => handleGetProductDetails(product?._id)} className='cursor-pointer hover:shadow-lg transition-shadow duration-300'>
            <div className="relative">
                <img 
                    src={product?.image} 
                    alt={product?.title}
                    className='w-full h-[300px] object-cover rounded-t-lg' />
                    {product?.totalStock === 0 ? (
                        <Badge className={'absolute top-2 left-2 bg-red-500 hover:bg-red-600'}>
                            Out of Stock
                        </Badge>
                    ): product?.totalStock < 10 ? (
                        <Badge className={'absolute top-2 left-2 bg-red-500 hover:bg-red-600'}>
                            {`only ${product?.totalStock} items left`}
                        </Badge>
                    ): product?.salePrice > 0 ? (
                        <Badge className={'absolute top-2 left-2 bg-red-500 hover:bg-red-600'}>
                            Sale
                        </Badge>
                    ): null}
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
            ): (
                <Button 
                onClick={()=>handleAddToCart(product?._id)}
                className={'w-full bg-primary hover:bg-primary/90 text-white'}>
                    Add to Cart
                </Button>
            )}
        </CardFooter>
    </Card>
  )
}

export default ShoppingProductTile