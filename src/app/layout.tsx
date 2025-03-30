import type { Metadata } from 'next';
import { Noto_Sans_Thai } from 'next/font/google';
import './globals.css';
import { ConfigProvider } from 'antd';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import dayjs from 'dayjs';

import customParseFormat from 'dayjs/plugin/customParseFormat';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import buddhistEra from 'dayjs/plugin/buddhistEra';
import thTH from 'antd/lib/locale/th_TH';

// Extend dayjs functionality
dayjs.extend(customParseFormat);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(buddhistEra);
dayjs.locale('th');

const notoSansThai = Noto_Sans_Thai({
  subsets: ['thai'],
  variable: '--font-noto-sans-thai',
});

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
    <html lang="en" className={`${notoSansThai.variable}`}>
      <body>
        <ConfigProvider
          locale={thTH}
          theme={{
            token: {
              fontFamily: `var(--font-noto-sans-thai)`,
              colorTextBase: '#404040',
              colorTextHeading: '#404040',
              colorText: '#404040',
            },
            components: {
              Button: {
                defaultShadow: '0 2px 0 rgba(0, 0, 0, 0)',
                paddingBlock: '12px',
                paddingInline: '16px',
              },
              Menu: {
                itemBorderRadius: 0,
                itemMarginInline: 0,
                padding: 16,
                itemPaddingInline: 16,
                subMenuItemBg: 'transparent',
                itemSelectedBg: '#E0F2FE',
                itemSelectedColor: '#0BA5EC',
              },
              Input: {
                controlHeightLG: 38,
              },
            },
          }}
        >
          <AntdRegistry>{children}</AntdRegistry>
        </ConfigProvider>
      </body>
    </html>
  );
}
