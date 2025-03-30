'use client';

import '@/components/Buttons/style.css';
import { Button, ButtonProps } from 'antd';
import React from 'react';

interface CustomButtonProps extends ButtonProps {
  theme?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

const CustomButton = ({
  children,
  onClick,
  className,
  theme,
  ...props
}: CustomButtonProps) => {
  const buttonTheme = () => {
    switch (theme) {
      case 'primary':
        return 'primary';
      case 'secondary':
        return 'secondary';
      case 'flat':
        return 'flat';
      case 'text-orange':
        return 'text-orange';
      case 'text-black':
        return 'text-black';
      default:
        return '';
    }
  };

  return (
    <Button
      {...props}
      onClick={onClick}
      className={`${className} ${buttonTheme()} inline-flex items-center justify-center`}
    >
      {children}
    </Button>
  );
};

export default CustomButton;
