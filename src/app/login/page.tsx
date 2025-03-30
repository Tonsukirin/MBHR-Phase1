import { LoginForm } from '@/components/LoginForm';
import React from 'react';
import Image from 'next/image';

const LoginPage = () => {
  return (
    <div>
      <Image
        className="absolute z-[-10] object-cover"
        alt=""
        fill
        src={'/img/login-bg.svg'}
      />
      <LoginForm />
    </div>
  );
};

export default LoginPage;
