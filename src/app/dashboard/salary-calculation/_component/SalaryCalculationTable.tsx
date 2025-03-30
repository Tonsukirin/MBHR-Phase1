'use client';

import { CustomButton } from '@/components/Buttons';
import { MonthSelector } from '@/components/Calendar/MonthSelector';
import {
  CalculatorOutlined,
  DownloadOutlined,
  DownOutlined,
  FileTextOutlined,
  ProfileOutlined,
} from '@ant-design/icons';
import { Table, TableColumnsType } from 'antd';
import Search from 'antd/es/input/Search';
import dayjs, { Dayjs } from 'dayjs';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { salaryCalculationTable, SalaryCalculationType } from './MockData';
import './style.css';

interface DownloadOption {
  label: string;
  icon: React.ReactNode;
}

const DOWNLOAD_OPTIONS: DownloadOption[] = [
  {
    label: 'รายงานสรุปเงินเดือน',
    icon: <ProfileOutlined />,
  },
  {
    label: 'สลิปเงินเดือนพนักงาน',
    icon: <FileTextOutlined />,
  },
  {
    label: 'สลิปเงินเดือน (รัฐบาล)',
    icon: <FileTextOutlined />,
  },
];

const SalaryCalculationTable: React.FC = () => {
  const [data] = useState<SalaryCalculationType[]>(salaryCalculationTable);
  const [currentDate, setCurrentDate] = useState<Dayjs>(dayjs());
  const [isOpen, setIsOpen] = useState(false);
  const [disableCalculation, _setDisableCalculation] = useState(true);
  const router = useRouter();

  const getDisbursementColumns =
    (): TableColumnsType<SalaryCalculationType> => [
      {
        title: 'ลำดับ',
        dataIndex: 'index',
        width: 60,
        render: (_, _record: SalaryCalculationType, index: number) => (
          <span>{index + 1}</span>
        ),
      },
      {
        title: 'รหัส',
        dataIndex: 'employeeId',
        width: 88,
        sorter: (a: SalaryCalculationType, b: SalaryCalculationType) => {
          const [prefixA, suffixA] = a.employeeId.split('-').map(Number);
          const [prefixB, suffixB] = b.employeeId.split('-').map(Number);
          if (prefixA !== prefixB) {
            return prefixA - prefixB;
          }
          return suffixA - suffixB;
        },
        render: (text: string, _record: SalaryCalculationType) => {
          return <span>{text}</span>;
        },
      },
      {
        title: 'พนักงาน',
        dataIndex: 'employeeName',
        render: (text: string, _record: SalaryCalculationType) => {
          return <span>{text}</span>;
        },
      },
      {
        title: 'รายได้รวม',
        dataIndex: 'totalIncome',
        width: 116,
        render: (value: number) => (
          <span>{value ? value.toLocaleString() : ''}</span>
        ),
      },
      {
        title: 'รายจ่ายรวม',
        dataIndex: 'totalExpense',
        width: 116,
        render: (value: number) => (
          <span>{value ? value.toLocaleString() : ''}</span>
        ),
      },
      {
        title: 'ประกันสังคม, 3%',
        dataIndex: 'socialSecurity',
        width: 140,
        render: (value: number) => (
          <span>{value ? value.toLocaleString() : ''}</span>
        ),
      },
      {
        title: 'รายได้สุทธิ',
        dataIndex: 'netIncome',
        width: 116,
        render: (value: number) => (
          <span>{value ? value.toLocaleString() : ''}</span>
        ),
      },
    ];

  const handleOptionSelect = (option: DownloadOption) => {
    console.log('User download : ', option.label);
  };

  const handleRowClick = (record: SalaryCalculationType) => {
    router.push(`/dashboard/salary-calculation/${record.id}`);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex relative w-full bg-[url(/img/salary-calc-bg.svg)] border border-black/5 rounded-2xl overflow-hidden items-center px-10 py-5 justify-between">
        <div className="flex z-10 items-center gap-4">
          <Image src={'/img/coin.svg'} alt={'coin'} height={80} width={80} />
          {disableCalculation ? (
            <div className="flex flex-col">
              <span className="font-semibold text-18">
                ยังไม่ถึงรอบคำนวณเงินเดือน สามารถคำนวณเงินเดือนได้ตั้งแต่วันที่
                21 เป็นต้นไป
              </span>
              <span>
                ระบบจะอนุญาตให้ดำเนินการได้ตั้งแต่วันที่ 21 ของเดือน
                เนื่องจากข้อมูลที่ใช้ในการคำนวณเงินเดือนยังไม่ครบถ้วน
              </span>
            </div>
          ) : (
            <div className="flex flex-col">
              <span className="font-semibold text-18">
                กรอกข้อมูลครบถ้วนแล้วใช่ไหม?
                กดปุ่มเพื่อคำนวณเงินเดือนทั้งหมดได้เลย!
              </span>
              <span>
                ข้อมูลเงินเดือนทั้งหมดจะถูกคำนวณจากข้อมูลในหน้า
                บันทึกการเข้าทำงาน, ระบบหักเงินพนักงาน และระบบเพิ่มเงินพิเศษ
              </span>
            </div>
          )}
        </div>
        <div>
          <CustomButton
            theme="secondary"
            className="w-[148px] h-[46px]"
            disabled={disableCalculation}
          >
            <div className="flex gap-[10px]">
              <CalculatorOutlined />
              <span>คำนวณเงินเดือน</span>
            </div>
          </CustomButton>
        </div>
      </div>
      <div className="flex gap-4 items-center">
        <Search
          size="large"
          placeholder="ค้นหาชื่อพนักงาน หรือ รหัสพนักงานที่นี่"
          allowClear
        />
        <div className="flex items-center justify-self-center">
          <MonthSelector value={currentDate} onChange={setCurrentDate} />
        </div>

        <div className="relative flex">
          <button
            onClick={() => setIsOpen(prev => !prev)}
            className="text-white text-14 px-4 py-2 rounded-md flex items-center justify-center w-[180px] h-[38px] gap-[10px] bg-[#F9991E] text-nowrap"
          >
            <DownloadOutlined />
            <span>ดาวน์โหลดเอกสาร</span>
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

      <Table<SalaryCalculationType>
        dataSource={data}
        columns={getDisbursementColumns()}
        rowKey="key"
        pagination={false}
        locale={{ emptyText: null }}
        onRow={record => ({
          onClick: () => handleRowClick(record),
        })}
        rootClassName="text-nowrap"
        rowClassName={(_, index) =>
          `custom-row ${index % 2 === 0 ? 'even-row' : 'odd-row'}`
        }
        scroll={{ y: 'calc(100vh - 440px)' }}
      />
    </div>
  );
};

export default SalaryCalculationTable;
