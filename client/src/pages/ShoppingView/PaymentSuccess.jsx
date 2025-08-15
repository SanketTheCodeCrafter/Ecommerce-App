import React from 'react'
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

const PaymentSuccess = () => {
    const navigate = useNavigate();
    return (
        <div className="flex items-center justify-center min-h-[80vh] bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
            <Card className="relative overflow-hidden p-0 shadow-2xl border-0 max-w-xl w-full bg-white rounded-3xl">
                {/* Decorative Gradient Circles */}
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-br from-purple-300 via-pink-200 to-blue-200 rounded-full opacity-30 blur-2xl pointer-events-none" />
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-tr from-blue-200 via-purple-200 to-pink-200 rounded-full opacity-30 blur-2xl pointer-events-none" />
                
                <div className="relative z-10 flex flex-col items-center px-8 py-16 text-center">
                    {/* Success Icon */}
                    <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-full p-4 shadow-lg mb-8 animate-bounce">
                        <CheckCircle2 className="text-white" size={72} />
                    </div>
                    
                    {/* Title */}
                    <div className="mb-6 text-center w-full">
                        <h1 className="text-4xl font-extrabold text-gray-800 drop-shadow-lg leading-tight">
                            Payment Successful!
                        </h1>
                    </div>
                    
                    {/* Confirmation Message */}
                    <div className="mb-10 space-y-2">
                        <p className="text-lg text-gray-600 font-medium">
                            Thank you for your purchase.
                        </p>
                        <p className="text-lg text-purple-500 font-semibold">
                            Your order is confirmed and being processed.
                        </p>
                    </div>
                    
                    {/* Action Button */}
                    <Button
                        className="px-12 py-4 text-lg rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 transition-all shadow-xl font-semibold tracking-wide mb-8"
                        onClick={() => navigate("/shop/account")}
                    >
                        View My Orders
                    </Button>
                    
                    {/* Help Link */}
                    <div className="text-sm text-gray-400">
                        <span>Need help? </span>
                        <a 
                            href="/shop/account" 
                            className="text-blue-500 underline hover:text-blue-700 transition-colors"
                        >
                            Contact Support
                        </a>
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default PaymentSuccess