import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { capturePayment } from '@/store/shop/order-slice';
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom';

const PaypalReturn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const params = new URLSearchParams(location.search);
  const token = params.get('token');
  const payerId = params.get('PayerID');

  useEffect(() => {
    const processPayment = async () => {
      if (token && payerId && !isProcessing) {
        setIsProcessing(true);
        
        const orderId = sessionStorage.getItem('currentOrderId');
        
        if (!orderId) {
          console.error('No order ID found in session storage');
          navigate('/shop/checkout');
          return;
        }

        try {
          const result = await dispatch(capturePayment({ 
            paymentId: token, 
            payerId, 
            orderId: JSON.parse(orderId) 
          }));

          if (result?.payload?.success) {
            sessionStorage.removeItem('currentOrderId');
            navigate('/shop/payment-success');
          } else {
            console.error('Payment capture failed:', result?.payload?.message);
            navigate('/shop/checkout');
          }
        } catch (error) {
          console.error('Payment capture error:', error);
          navigate('/shop/checkout');
        }
      } else if (!token || !payerId) {
        console.error('Missing PayPal token or payer ID');
        navigate('/shop/checkout');
      }
    };

    processPayment();
  }, [token, payerId, dispatch, navigate, isProcessing]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-96">
        <CardHeader>
          <CardTitle className="text-center">
            {isProcessing ? 'Processing your Payment...' : 'Redirecting...'}
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
};

export default PaypalReturn;