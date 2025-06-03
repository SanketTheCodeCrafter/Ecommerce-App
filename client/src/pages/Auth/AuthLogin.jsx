import Form from '@/components/CommonCompo/Form';
import { loginFormControls, registerFormControls } from '@/config/registerFormControls';
import { loginUser } from '@/store/auth-slice';
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';


const initialState= {
  email: '',
  password: '',
}

const AuthLogin = () => {
  const [formData, setFormData] = useState(initialState);
  const dispatch= useDispatch();

  function onSubmit(e){
    e.preventDefault();

    dispatch(loginUser(formData)).then((data)=>{
      if(data?.payload?.success){
        toast.success('Login successful!');
        console.log('Login successful:', data.payload);
      }else{
        toast.error(data?.payload?.message || 'Login failed');
        console.error('Login failed:', data.payload);
      }
      
    })
  }


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
      />
    </div>
  )
}

export default AuthLogin