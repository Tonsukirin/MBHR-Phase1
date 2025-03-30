'use client';

import { ArrowLeftOutlined } from '@ant-design/icons';
import { Breadcrumb, Spin } from 'antd';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import PayrollExtraTable from './_component/PayrollExtraTable';

const PayrollExtra = () => {
  const [loading, _setLoading] = useState(false);
  const router = useRouter();
  return (
    <div className="flex flex-col justify-between h-full w-full max-w-[1080px]">
      {loading ? (
        <Spin
          tip="Loading..."
          className="flex justify-center items-center flex-1"
        />
      ) : (
        <div className="flex flex-col gap-6 h-full w-full">
          <Breadcrumb
            items={[
              {
                title: 'หน้าหลัก',
                href: '/dashboard',
              },
              {
                title: 'จัดการเงินเดือน',
              },
              {
                title: 'ระบบเพิ่มเงินพิเศษ',
              },
            ]}
          />
          <div className="flex gap-2">
            <ArrowLeftOutlined onClick={() => router.push('/dashboard')} />
            <span className="font-semibold text-20">ระบบเพิ่มเงินพิเศษ</span>
          </div>

          <PayrollExtraTable />
        </div>
      )}
    </div>
  );
};

export default PayrollExtra;
