import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { setGoogleAuthUser } from '@/store/auth-slice';
import { toast } from 'sonner';

const GoogleAuthSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const token = searchParams.get('token');

        if (token) {
            try {
                // Decode the JWT to get user info
                const decoded = jwtDecode(token);

                // Set user in Redux store
                dispatch(setGoogleAuthUser({
                    id: decoded.id,
                    email: decoded.email,
                    userName: decoded.userName,
                    role: decoded.role,
                }));

                toast.success('Logged in with Google successfully!');

                // Redirect based on role
                if (decoded.role === 'admin') {
                    navigate('/admin/products');
                } else {
                    navigate('/shop/home');
                }
            } catch (error) {
                console.error('Error processing Google auth:', error);
                toast.error('Failed to complete Google login');
                navigate('/auth/login');
            }
        } else {
            toast.error('No authentication token received');
            navigate('/auth/login');
        }
    }, [searchParams, dispatch, navigate]);

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Completing Google sign-in...</p>
            </div>
        </div>
    );
};

export default GoogleAuthSuccess;
