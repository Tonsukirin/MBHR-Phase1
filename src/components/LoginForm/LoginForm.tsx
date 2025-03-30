'use client';

import { useUserStore } from '@/app/stores/userStore';
import { userLogin } from '@/services/Auth/userLogin';
import { Form, Input } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import Cookies from 'universal-cookie';
import { CustomButton } from '../Buttons';

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({
    username: false,
    password: false,
  });

  const router = useRouter();
  const cookies = new Cookies();

  const handleLogin = async () => {
    setError('');
    console.log(username, password);

    try {
      const response = await userLogin({ username, password });
      console.log(response);

      useUserStore.getState().setUsername(response.data.user.username);
      cookies.set('jwt_authorization', response.data.token, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
      router.push('/dashboard');
    } catch (error) {
      console.error('Error fetching employee data:', error);
      setError('รหัสผ่านไม่ถูกต้อง โปรดลองใหม่อีกครั้ง');
      setFieldErrors({ username: true, password: true });
    }
  };

  const handleLoginFailed = () => {
    setError('กรุณากรอกทั้งชื่อผู้ใช้และรหัสผ่าน');
  };

  return (
    <div className="grid place-items-center h-screen">
      <div className="flex flex-col items-center rounded-[24px] bg-white shadow-login px-16 py-8 w-[448px]">
        <Image
          src={'/img/mb.svg'}
          alt="moral business"
          height={120}
          width={120}
          priority={true}
          className="mb-6"
        />
        <Form
          name="basic"
          layout="vertical"
          onFinish={handleLogin}
          onFinishFailed={handleLoginFailed}
          autoComplete="off"
          className="flex flex-col w-full"
          requiredMark={false}
        >
          <Form.Item
            label="Username"
            name="username"
            style={{ marginBottom: '20px' }}
            rules={[{ required: true, message: '' }]}
            validateStatus={fieldErrors.username ? 'error' : undefined}
          >
            <Input
              value={username}
              onChange={e => {
                setUsername(e.target.value);
                setFieldErrors(prev => ({ ...prev, username: false }));
              }}
              placeholder="Username"
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            style={{ marginBottom: '16px' }}
            rules={[{ required: true, message: '' }]}
            validateStatus={fieldErrors.password ? 'error' : undefined}
          >
            <div>
              <Input.Password
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                  setFieldErrors(prev => ({ ...prev, password: false }));
                }}
                placeholder="Password"
              />
              <div className="text-12 py-1 h-[20px]">
                {error && <p className="error text-red-500">{error}</p>}
              </div>
            </div>
          </Form.Item>

          <Form.Item label={null} style={{ marginBottom: '0px' }}>
            <CustomButton
              className="w-full px-4 py-3 h-[48px]"
              theme="primary"
              htmlType="submit"
            >
              Login
            </CustomButton>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginForm;
