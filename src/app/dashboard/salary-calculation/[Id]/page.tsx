'use client';

import {
  ArrowLeftOutlined,
  DownloadOutlined,
  DownOutlined,
  FileTextOutlined,
  LeftOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Button, Spin } from 'antd';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import DailySalaryOverview from './_component/DailySalaryOverview';
import './style.css';

interface DownloadOption {
  label: string;
  icon: React.ReactNode;
}

const DOWNLOAD_OPTIONS: DownloadOption[] = [
  {
    label: 'รายงานสรุปเงินเดือน',
    icon: <FileTextOutlined />,
  },
  {
    label: 'สลิปเงินเดือนพนักงาน',
    icon: <FileTextOutlined />,
  },
];

const SalaryCalculationOverview = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, _setLoading] = useState(false);
  const router = useRouter();

  const handleOptionSelect = (option: DownloadOption) => {
    console.log('User download : ', option.label);
  };

  return (
    <div className="flex flex-col justify-between h-full w-full">
      {loading ? (
        <Spin
          tip="Loading..."
          className="flex justify-center items-center flex-1"
        />
      ) : (
        <div className="flex flex-col gap-10 h-full w-full">
          <div className="flex flex-col gap-6">
            <Breadcrumb
              items={[
                {
                  title: 'หน้าหลัก',
                  href: '/dashboard',
                },
                {
                  title: 'ระบบคำนวณเงินเดือน',
                },
                {
                  title: 'รายการคำนวณเงินเดือน',
                },
                {
                  title: 'test',
                },
              ]}
            />

            <div className="flex justify-between">
              <div className="flex gap-2 items-center">
                <ArrowLeftOutlined onClick={() => router.push('/dashboard')} />
                <span className="font-semibold text-20">
                  รายการคำนวณเงินเดือน
                </span>
              </div>
              <div className="relative flex">
                <button
                  onClick={() => setIsOpen(prev => !prev)}
                  className="text-white text-14 px-4 py-2 rounded-md flex items-center justify-center h-[38px] gap-[10px] bg-[#F9991E] text-nowrap"
                >
                  <DownloadOutlined />
                  <span>ดาวน์โหลดสลิป</span>
                  <DownOutlined />
                </button>

                {isOpen && (
                  <div className="absolute top-full left-0 mt-1 py-1 w-[180px] bg-white shadow-xl rounded-sm z-50 custom-dropdown-style">
                    {DOWNLOAD_OPTIONS.map((option, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-[#F6F6F6]"
                        onClick={() => {
                          handleOptionSelect(option);
                          setIsOpen(false);
                        }}
                      >
                        <span>{option.icon}</span>
                        <span className="text-14 font-regular text-nowrap">
                          {option.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-10 ml-6">
            {/* upper */}
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <div className="flex gap-4 items-center">
                  <Button
                    shape="circle"
                    size="small"
                    className="text-[#F9991E] bg-[#FFF8E8] hover:bg-[#FFE4C2] border-none shadow-none"
                    icon={<LeftOutlined className="text-10" />}
                  />
                  <div className="flex gap-2">
                    <span className="text-20 font-semibold">name</span>
                    <span className="text-20 text-[#6B6B6B]">(id)</span>
                  </div>
                  <Button
                    shape="circle"
                    size="small"
                    className="bg-[#FFF8E8] text-[#F9991E] border-none shadow-none hover:bg-[#FFE4C2]"
                    icon={<RightOutlined className="text-10" />}
                  />
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-20">รายได้สุทธิ</span>
                  <span className="text-[#6B6B6B] font-regular text-18">
                    xx บาท
                  </span>
                </div>
              </div>

              <div className="flex gap-6">
                <span className="text-inactive">หน่วยงาน</span>
                <span>test test</span>
              </div>
            </div>
            {/* lower */}
            <DailySalaryOverview />
          </div>
        </div>
      )}
    </div>
  );
};

export default SalaryCalculationOverview;
