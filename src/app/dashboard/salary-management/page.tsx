'use client';

import { ArrowLeftOutlined } from '@ant-design/icons';
import { Breadcrumb, Spin, Tabs } from 'antd';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import DisbursementTable from './_component/DisbursementTable';
import EtcTable from './_component/EtcTable';
import LoanTable from './_component/LoanTable';
import UniformTable from './_component/UniformTable';
import './style.css';

const SalaryManagement = () => {
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
                title: 'ระบบหักเงินพนักงาน',
              },
            ]}
          />
          <div className="flex gap-2">
            <ArrowLeftOutlined onClick={() => router.push('/dashboard')} />
            <span className="font-semibold text-20">ระบบหักเงินพนักงาน</span>
          </div>

          <Tabs
            defaultActiveKey="1"
            size="large"
            items={[
              {
                key: '1',
                label: 'เบิกเงิน',
                children: (
                  <div id="disbursement-table">
                    <DisbursementTable />
                  </div>
                ),
              },
              {
                key: '2',
                label: 'ชุดฟอร์ม',
                children: (
                  <div className="flex flex-col gap-4">
                    <div id="uniform-table">
                      <UniformTable />
                    </div>
                  </div>
                ),
              },
              {
                key: '3',
                label: 'ระบบกู้ยืมเงืน',
                children: (
                  <div className="flex flex-col gap-4">
                    <div id="loan-table">
                      <LoanTable />
                    </div>
                  </div>
                ),
              },
              {
                key: '4',
                label: 'อื่นๆ',
                children: (
                  <div className="flex flex-col gap-4">
                    <div id="etc-table">
                      <EtcTable />
                    </div>
                  </div>
                ),
              },
            ]}
          />
        </div>
      )}
    </div>
  );
};

export default SalaryManagement;
