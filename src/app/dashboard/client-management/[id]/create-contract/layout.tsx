import { ConfigProvider } from 'antd';
import React from 'react';

const CreateContractLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <ConfigProvider
      theme={{
        components: {
          Collapse: {
            paddingSM: 16,
          },
        },
      }}
    >
      <div>{children}</div>
    </ConfigProvider>
  );
};

export default CreateContractLayout;
