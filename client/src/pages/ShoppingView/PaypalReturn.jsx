import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { capturePayment } from '@/store/shop/order-slice';
import { checkAuth } from '@/store/auth-slice';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom';

const PaypalReturn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  const params = new URLSearchParams(location.search);
  const token = params.get('token');
  const payerId = params.get('PayerID');

  useEffect(() => {
    // First, ensure user is authenticated
    if (!isAuthenticated) {
      dispatch(checkAuth()).then((result) => {
        if (!result.payload?.success) {
          // If still not authenticated, redirect to login
          navigate('/auth/login');
          return;
        }
        // If authentication successful, proceed with payment
        handlePayment();
      });
    } else {
      // User is already authenticated, proceed with payment
      handlePayment();
    }
  }, [isAuthenticated, token, payerId, dispatch, navigate]);

  const handlePayment = () => {
    if (token && payerId) {
      const orderId = JSON.parse(sessionStorage.getItem('currentOrderId'));

      if (!orderId) {
        console.error('No order ID found in session storage');
        navigate('/shop/checkout');
        return;
      }

      dispatch(capturePayment({ paymentId: token, payerId, orderId })).then((data) => {
        if (data?.payload?.success) {
          sessionStorage.removeItem('currentOrderId');
          navigate('/shop/payment-success');
        } else {
          console.error('Payment capture failed:', data?.payload?.message);
          navigate('/shop/checkout');
        }
      }).catch((error) => {
        console.error('Payment capture error:', error);
        navigate('/shop/checkout');
      });
    } else {
      console.error('Missing PayPal token or payer ID');
      navigate('/shop/checkout');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Processing your Payment....</CardTitle>
      </CardHeader>
    </Card>
  )
}

export default PaypalReturn