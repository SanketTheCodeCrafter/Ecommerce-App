import React, { use } from 'react'
import { Button } from '../ui/button'
import { Minus, Plus, Trash } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteCartItem, updateCartQuantity } from '@/store/shop/cart-slice'
import { toast } from 'sonner'


const UserCartItemsContent = ({ cartItem }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.shopCart);
  const { productList } = useSelector((state) => state.shopProducts);


  function handleCartItemDelete(getCartItem) {
    dispatch(deleteCartItem({ userId: user?.id, productId: getCartItem?.productId })).then((data) => {
      if (data?.payload?.success) {
        toast.success("Item removed from cart")
      }
    });
  }

  function handleUpdateQuantity(getCartItem, typeOfAction) {
    if (typeOfAction === 'increase') {
      const getCartItems = cartItems?.items || [];

      if (getCartItems.length) {
        const indexOfCurrentCartItem = getCartItems.findIndex((item) => item.productId === getCartItem?.productId);

        const currentProduct = productList.find((product) => product._id === getCartItem?.productId);
        const getTotalStock = currentProduct?.totalStock;

        if (indexOfCurrentCartItem > -1) {
          const getQuantity = getCartItems[indexOfCurrentCartItem].quantity;
          if (typeof getTotalStock === 'number' && getQuantity + 1 > getTotalStock) {
            toast.warning(`Only ${getQuantity} items left in stock`)
            return;
          }
        }
      }
    }

    dispatch(updateCartQuantity({userId: user?.id,
      productId: getCartItem?.productId, quantity: typeOfAction === 'increase' ? getCartItem?.quantity + 1 : getCartItem?.quantity -1,
    })).then((data) => {
      if(data?.payload?.success){
        toast.success('Cart item is updated successfully')
      }
    })
  }

  return (
    <div className='flex items-center space-x-4'>
      <img
        src={cartItem?.image}
        alt={cartItem?.title}
        className='w-20 h-20 rounded object-cover'
      />
      <div className="flex-1">
        <h3 className='font-extrabold'>{cartItem?.title}</h3>
        <div className="flex items-center gap-2 mt-1">
          <Button
            variant={'outline'}
            className={'h-8 w-8 rounded-full'}
            size={'icon'}
            disabled={cartItem?.quantity === 1}
            onClick={() => handleUpdateQuantity(cartItem, 'decrease')}
          >
            <Minus className='w-4 h-4' />
            <span className='sr-only'>Decrease</span>
          </Button>
          <span className='font-semibold'>{cartItem?.quantity}</span>
          <Button
            variant={'outline'}
            className={'h-8 w-8 rounded-full'}
            size={'icon'}
            disabled={cartItem?.quantity === 200}
            onClick={() => handleUpdateQuantity(cartItem, 'increase')}
          >
            <Plus className='w-4 h-4' />
            <span className='sr-only'>Increase</span>
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <p className='font-semibold'>
          ${(
            (cartItem?.salePrice > 0 ? cartItem?.salePrice : cartItem?.price) *
            cartItem?.quantity
          ).toFixed(2
          )}
        </p>
        <Trash
          className='cursor-pointer mt-1'
          size={20}
          onClick={() => handleCartItemDelete(cartItem)}
        />
      </div>
    </div>
  )
}

export default UserCartItemsContent