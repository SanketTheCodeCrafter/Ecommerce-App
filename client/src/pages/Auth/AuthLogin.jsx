import Form from '@/components/CommonCompo/Form';
import { loginFormControls, registerFormControls } from '@/config/registerFormControls';
import { loginUser } from '@/store/auth-slice';
import React, { useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';


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
    </div>
  )
}

export default AuthLogin