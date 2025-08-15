import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { capturePayment } from '@/store/shop/order-slice';
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom';

const PaypalReturn = () => {
  const dispatch=useDispatch();
  const location=useLocation();
  const params=new URLSearchParams(location.search);
  const token=params.get('token');
  const payerId=params.get('PayerID');

  useEffect(()=>{
    if(token && payerId){
      const orderId=JSON.parse(sessionStorage.getItem('currentOrderId'));

      dispatch(capturePayment({paymentId: token, payerId, orderId})).then((data)=>{
        if(data?.payload?.success){
          sessionStorage.removeItem('currentOrderId');
          window.location.href='/shop/payment-success';
        }
      });
    }
  },[token, payerId, dispatch]);

  // useEffect(()=>{
  //   if(sessionStorage.getItem('currentOrderId')){
  //     const orderId=JSON.parse(sessionStorage.getItem('currentOrderId'));
  //   }
  // },[])
  return (
    <Card>
      <CardHeader>
        <CardTitle>Processing your Payment....</CardTitle>
      </CardHeader>
    </Card>
  )
}

export default PaypalReturn