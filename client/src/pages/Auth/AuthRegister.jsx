import Form from '@/components/CommonCompo/Form';
import { registerFormControls } from '@/config/registerFormControls';
import { registerUser } from '@/store/auth-slice';
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';



const initialState = {
  userName: '',
  email: '',
  password: '',
}

const AuthRegister = () => {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function onSubmit(e) {
    e.preventDefault();
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
      });
  }


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
      />
    </div>
  )
}

export default AuthRegister