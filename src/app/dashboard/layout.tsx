import { Navbar } from '@/components/Navbar';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider } from 'antd';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Moral Business HR',
  description: 'MBHR System',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConfigProvider
      theme={{
        components: {
          Pagination: {
            colorPrimary: '#F9991E',
            colorPrimaryHover: '#FA8C16',
            borderRadius: 2,
          },
          Modal: {
            titleFontSize: 22,
            borderRadiusLG: 16,
          },
          Select: {
            activeBorderColor: '#F48625',
            activeOutlineColor: 'rgba(249, 153, 30, 0.15)',
            hoverBorderColor: '#F48625',
          },
          Input: {
            activeBorderColor: '#F48625',
            controlOutline: 'rgba(249, 153, 30, 0.15)',
            hoverBorderColor: '#F48625',
          },
          Radio: {
            colorPrimary: '#F9991E',
            dotSize: 8,
          },
          DatePicker: {
            activeBorderColor: '#F48625',
            hoverBorderColor: '#F48625',
            colorPrimary: '#F48625',
          },
          Collapse: { headerBg: '#F6F6F6', colorBorder: '#EFEFEF' },
          Switch: {
            colorPrimary: '#F9991E',
            colorPrimaryHover: '#FA8C16',
          },
          Popconfirm: {
            colorPrimaryBg: '#F9991E',
          },
        },
      }}
    >
      <div className="flex w-screen">
        <Navbar />
        <AntdRegistry>
          <div className="w-full m-[40px] mb-[27px]">{children}</div>
        </AntdRegistry>
      </div>
    </ConfigProvider>
  );
}
