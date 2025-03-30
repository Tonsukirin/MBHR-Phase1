import { ConfigProvider } from 'antd';
import React from 'react';

const SalaryCalculationOverviewLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <ConfigProvider>
      <div>{children}</div>
    </ConfigProvider>
  );
};

export default SalaryCalculationOverviewLayout;
