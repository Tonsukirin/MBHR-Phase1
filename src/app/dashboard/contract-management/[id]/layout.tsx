import { ConfigProvider } from 'antd';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Moral Business HR',
  description: 'MBHR System',
};

export const dynamic = 'force-static';

export default function ContractOverviewLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConfigProvider>
      <div className="flex w-screen">
        <div className="w-full -ml-[16px]">{children}</div>
      </div>
    </ConfigProvider>
  );
}
