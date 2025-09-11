import React from 'react'
import { Card, CardContent, CardFooter } from '../ui/card'
import { Button } from '../ui/button'

const AdminProductTile = ({
  product,
  setFormData,
  setOpenCreateProductsDialog,
  setCurrentEditedId,
  handleDelete
}) => {
  const discountPercent = product?.salePrice > 0 && product?.price > 0
    ? Math.round((1 - (product?.salePrice / product?.price)) * 100)
    : null;
  return (
    <Card className={'w-full max-w-sm mx-auto p-0 pb-4 rounded-xl shadow-sm hover:shadow-lg transition-shadow'} >
      <div className="group">
        <div className="relative overflow-hidden rounded-t-xl">
          {product?.salePrice > 0 ? (
            <span className="absolute left-3 top-3 z-10 rounded-full bg-red-500/90 text-white text-xs font-semibold px-2 py-0.5">
              {discountPercent ? `-${discountPercent}%` : 'Sale'}
            </span>
          ) : null}
          <img src={product?.image} alt={product?.title}
            className='w-full h-[260px] object-cover transition-transform duration-300 group-hover:scale-[1.03]' />
        </div>

        <CardContent className={'pt-3'}>
          <h2 className='text-base font-semibold mb-2 line-clamp-2'>{product?.title}</h2>
          <div className="flex items-center justify-between mb-2">
            <div className='flex flex-wrap gap-2'>
              {product?.category ? (
                <span className='inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs text-slate-700'>
                  {product.category}
                </span>
              ) : null}
              {product?.brand ? (
                <span className='inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs text-slate-700'>
                  {product.brand}
                </span>
              ) : null}
            </div>
            {product?.totalStock !== undefined ? (
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border ${Number(product.totalStock) > 0 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                {Number(product.totalStock) > 0 ? `${product.totalStock} in stock` : 'Out of stock'}
              </span>
            ) : null}
          </div>
          <div className="flex justify-between items-end">
            <div className="flex items-baseline gap-2">
              <span
                className={`${product?.salePrice > 0 ? 'line-through text-slate-400' : "text-slate-900"} text-lg font-semibold`}
              >${product?.price}</span>
              {product?.salePrice > 0 ? (
                <span className='text-lg font-bold text-slate-900'>${product?.salePrice}</span>
              ) : null}
            </div>
          </div>
        </CardContent>

        <CardFooter className={'flex justify-between items-center gap-3 px-4'} >
          <Button
            variant={'outline'}
            className={'w-1/2'}
            onClick={()=>{
              setCurrentEditedId(product?._id)
              setFormData(product)
              setOpenCreateProductsDialog(true)
            }}
          >Edit</Button>
          <Button
            className={'w-1/2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200'}
            onClick={()=>handleDelete(product?._id)}
          >Delete</Button>
        </CardFooter>
      </div>
    </Card>
  )
}

export default AdminProductTile