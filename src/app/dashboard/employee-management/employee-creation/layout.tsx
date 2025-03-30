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
          Modal: {
            titleFontSize: 20,
            borderRadiusLG: 16,
          },
          Table: {
            headerBg: '#EFEFEF',
            borderRadiusLG: 0,
            headerSplitColor: '#E0E0E0',
            footerBg: 'transparent',
          },
        },
      }}
    >
      <div>{children}</div>
    </ConfigProvider>
  );
}
