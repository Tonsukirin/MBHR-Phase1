import { ConfigProvider } from 'antd';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Moral Business HR',
  description: 'MBHR System',
};

export const dynamic = 'force-static';

export default function DailyActivityLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConfigProvider
      theme={{
        components: {
          Tabs: {
            itemSelectedColor: '#F9991E',
            inkBarColor: '#F9991E',
          },
          Table: {
            headerBg: '#EFEFEF',
            borderRadiusLG: 0,
            headerSplitColor: '#E0E0E0',
          },
        },
      }}
    >
      <div>{children}</div>
    </ConfigProvider>
  );
}
