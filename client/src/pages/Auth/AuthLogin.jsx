import Form from '@/components/CommonCompo/Form';
import { loginFormControls, registerFormControls } from '@/config/registerFormControls';
import { loginUser } from '@/store/auth-slice';
import React, { useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

// Auto-select API URL based on environment
const API_BASE_URL = import.meta.env.MODE === 'production'
  ? import.meta.env.VITE_API_BASE_URL_PROD
  : import.meta.env.VITE_API_BASE_URL_DEV;

const initialState = {
  email: '',
  password: '',
}

const AuthLogin = () => {
  const [formData, setFormData] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);

  function onSubmit(e) {
    e.preventDefault();

    // Prevent duplicate submissions using ref (immediate check)
    if (isSubmittingRef.current || isLoading) {
      return;
    }

    // Set both state and ref to prevent duplicates
    isSubmittingRef.current = true;
    setIsSubmitting(true);

    dispatch(loginUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast.success('Login successful!');
        console.log('Login successful:', data.payload);
      } else {
        toast.error(data?.payload?.message || 'Login failed');
        console.error('Login failed:', data.payload);
      }
    }).finally(() => {
      // Reset submission state after request completes
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    });
  }

  function handleGoogleLogin() {
    window.location.href = `${API_BASE_URL}/api/auth/google`;
  }

  // Button is disabled only when form fields are empty
  const isButtonDisabled = !formData.email || !formData.password;

  return (
    <div className='mx-auto w-full max-w-md space-y-6'>
      <div className="text-center">
        <h1 className='text-3xl font-bold tracking-tight text-foreground'>
          Login to your account
        </h1>
        <p className='mt-2'>
          Don't have an account?
        </p>
        <Link className='font-medium ml-2 text-primary hover:underline'
          to={'/auth/register'}>
          Register
        </Link>
      </div>

      <Form
        formControls={loginFormControls}
        buttonText={"Sign In"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
        isBtnDisabled={isButtonDisabled}
        isLoading={isSubmitting}
      />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center gap-3 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        Continue with Google
      </button>
    </div>
  )
}

export default AuthLogin