import { current } from '@reduxjs/toolkit';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import img from "../../assets/account.jpg";
import Address from '@/components/ShoppingView/Address';
import UserCartItemsContent from '@/components/ShoppingView/UserCartItemsContent';
import { Button } from '@/components/ui/button';
import { createNewOrder } from '@/store/shop/order-slice';
import { useEffect } from 'react';
import { toast } from 'sonner';

const CheckOut = () => {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const dispatch = useDispatch();
  const [isPaymentStart, setIsPaymentStart] = useState(false);
  const { approvalUrl } = useSelector((state) => state.shopOrder);

  const totalCartAmount = cartItems && cartItems.items && cartItems.items.length > 0 ?
    cartItems.items.reduce((sum, currentItem) =>
      sum + (currentItem?.salePrice > 0 ? currentItem?.salePrice : currentItem?.price) * currentItem?.quantity, 0) : 0;


  function handleInitiatePaypalPayment() {
    // console.log('currentSelectedAddress', currentSelectedAddress);

    if (cartItems == null || cartItems.items == null || cartItems.items.length == 0) {
      toast.warning('No items in cart...');
      return;
    }

    if (currentSelectedAddress == null) {
      toast.warning('Please select an address to proceed...');
      return;
    }

    const orderData = {
      userId: user?.id,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map((singleCartItem) => ({
        productId: singleCartItem?.productId,
        title: singleCartItem?.title,
        image: singleCartItem?.image,
        price: singleCartItem?.salePrice > 0 ? singleCartItem?.salePrice : singleCartItem?.price,
        quantity: singleCartItem?.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
      },
      orderStatus: "Pending",
      paymentMethod: "PayPal",
      paymentStatus: "Pending",
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "",
      payerId: "",
    };

    console.log('orderData', orderData);

    dispatch(createNewOrder(orderData)).then((data) => {
      console.log('Order creation response:', data);

      if (data?.payload && data?.payload?.success) {
        setIsPaymentStart(true);
      } else {
        setIsPaymentStart(false);
      }
    });
  }

  if (approvalUrl) {
    console.log('approvalUrl', approvalUrl);
    window.location.href = approvalUrl;
  }

  return (
    <div className='flex flex-col'>
      <div className="relatve h-[300px] w-full overflow-hidden">
        <img src={img} className='h-full w-full object-cover object-center' />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
        <Address setCurrentSelectedAddress={setCurrentSelectedAddress} />
        <div className="flex flex-col gap-4">
          {cartItems && cartItems.items && cartItems.items.length > 0 ?
            cartItems.items.map((item) => (
              <UserCartItemsContent cartItem={item} key={item._id} />
            )) : <div className='text-center'>No items in cart</div>}
          <div className="mt-8 space-y-4">
            <div className="flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-bold">${totalCartAmount}</span>
            </div>
          </div>
          <div className="mt-4 w-full">
            <Button className={'w-full'} onClick={handleInitiatePaypalPayment}>
              Checkout with PayPal
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckOut