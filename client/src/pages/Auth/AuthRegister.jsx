import Form from '@/components/CommonCompo/Form';
import { registerFormControls } from '@/config/registerFormControls';
import { registerUser } from '@/store/auth-slice';
import React, { useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';



const initialState = {
  userName: '',
  email: '',
  password: '',
}

const AuthRegister = () => {
  const [formData, setFormData] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
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

    dispatch(registerUser(formData))
      .unwrap()
      .then((response) => {
        toast.success('Registration successful!')
        console.log('Registration successful:', response);
        if (response?.success) {
          navigate('/auth/login');
        }

      })
      .catch((error) => {
        toast.error(error?.message || 'Registration failed');
        console.error('Registration failed:', error);
      })
      .finally(() => {
        // Reset submission state after request completes
        isSubmittingRef.current = false;
        setIsSubmitting(false);
      });
  }

  // Button is disabled only when form fields are empty
  const isButtonDisabled = !formData.userName || !formData.email || !formData.password;

  return (
    <div className='mx-auto w-full max-w-md space-y-6'>
      <div className="text-center">
        <h1 className='text-3xl font-bold tracking-tight text-foreground'>
          Create new account
        </h1>
        <p className='mt-2'>
          Already have an account
        </p>
        <Link className='font-medium ml-2 text-primary hover:underline'
          to={'/auth/login'}>
          Login
        </Link>
      </div>

      <Form
        formControls={registerFormControls}
        buttonText={"Sign Up"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
        isBtnDisabled={isButtonDisabled}
        isLoading={isSubmitting}
      />
    </div>
  )
}

export default AuthRegister