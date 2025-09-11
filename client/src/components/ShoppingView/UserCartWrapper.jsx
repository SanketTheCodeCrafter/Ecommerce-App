import React from 'react'
import { SheetContent, SheetHeader, SheetTitle } from '../ui/sheet'
import { Button } from '../ui/button'
import UserCartItemsContent from './UserCartItemsContent'
import { useNavigate } from 'react-router-dom'

const UserCartWrapper = ({cartItems, setOpenCartSheet}) => {

  const navigate=useNavigate();

  const totalCartAmount = 
  cartItems && cartItems.length > 0 ? 
  cartItems.reduce(
    (sum, currentItem) =>
      sum +
      ((currentItem?.salePrice > 0
        ? currentItem?.salePrice
        : currentItem?.price) *
        (currentItem?.quantity || 0)),
    0
  ) : 0;

  return (
    <SheetContent className={'sm:max-w-md md:max-w-lg p-0 bg-white rounded-l-xl shadow-xl'}>
        <div className="flex h-full flex-col">
          <div className="px-5 py-4 border-b">
            <SheetHeader>
              <SheetTitle className={'text-xl font-semibold'}>Your Cart</SheetTitle>
            </SheetHeader>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4">
            <div className="space-y-4">
              {
                cartItems && cartItems.length > 0 
                ? cartItems.map((item) => <UserCartItemsContent cartItem={item} key={item?._id || item?.productId} />)
                : <div className='text-center text-sm text-slate-500'>Your cart is empty</div>
              }
            </div>
          </div>

          <div className="border-t px-5 py-4 bg-white">
            <div className="flex items-center justify-between">
              <span className='text-sm text-slate-600'>Total</span>
              <span className='text-base font-semibold text-slate-900'>${totalCartAmount}</span>
            </div>
            <Button
              onClick={() => {
                setOpenCartSheet(false);  
                navigate('/shop/checkout');  
              }} 
              className={'w-full mt-4 h-11 text-[15px]'}
            >
              Checkout
            </Button>
          </div>
        </div>
    </SheetContent>
  )
}

export default UserCartWrapper