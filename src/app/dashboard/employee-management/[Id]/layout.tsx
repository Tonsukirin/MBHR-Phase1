import { ConfigProvider } from 'antd';
import React from 'react';

const EmployeeLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <ConfigProvider
      theme={{
        components: {
          Modal: {
            titleFontSize: 20,
            borderRadiusLG: 16,
          },
          Card: {
            paddingLG: 12,
          },
          Table: {
            headerBg: '#EFEFEF',
            borderRadiusLG: 0,
            headerSplitColor: '#E0E0E0',
            footerBg: 'transparent',
          },
          Divider: {
            marginLG: 40,
          },
        },
      }}
    >
      <div>{children}</div>
    </ConfigProvider>
  );
};

export default EmployeeLayout;
