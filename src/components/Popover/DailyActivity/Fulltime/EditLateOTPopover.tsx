'use client';

import { UserOutlined } from '@ant-design/icons';
import { Input, Popover } from 'antd';
import { Dayjs } from 'dayjs';
import 'dayjs/locale/th';
import React, { useState } from 'react';
import { CustomButton } from '../../../Buttons';
import '../style.css';

export interface EditLateOTPopoverInputData {
  OT1_5?: number;
  OT2?: number;
  OT3?: number;
  lateMinutes?: number;
}

export type StatusOption = {
  label:
    | 'เข้าทำงาน'
    | 'มาสาย'
    | 'ไม่เข้าทำงาน'
    | 'ทำ OT'
    | 'มาสาย & OT'
    | 'อบรมหน้างาน'
    | 'ลบสถานะ';
  icon: React.ReactNode;
};

export interface EditLateOTPopoverProps {
  children: React.ReactNode;
  date: Dayjs;
  employeeName: string;
  employeeId: string;
  status: StatusOption;
  onSave: (inputData: EditLateOTPopoverInputData) => void;
  onCancel: () => void;
}

const EditLateOTPopover: React.FC<EditLateOTPopoverProps> = ({
  children,
  date,
  employeeId,
  employeeName,
  status,
  onSave,
  onCancel,
}) => {
  const [visible, setVisible] = useState<boolean>(true);
  const thaiDate = date.locale('th');
  const formattedDate = `${thaiDate.format('D MMM')}`;

  const handleVisibleChange = (newVisible: boolean): void => {
    if (!newVisible) {
      setVisible(false);
      onCancel();
    }
  };

  const handleSave = (): void => {
    onSave({}); //handle save data
    setVisible(false);
  };

  return (
    <Popover
      placement="left"
      open={visible}
      onOpenChange={handleVisibleChange}
      trigger="click"
      title={
        <div className="flex items-center gap-2">
          <div>{status.icon}</div>
          <div className="font-semibold">{status.label}</div>
          {' - '}
          <span className="text-[#6B6B6B] font-regular">{formattedDate}</span>
        </div>
      }
      content={
        <div className="flex flex-col gap-3">
          <div className="flex gap-1 items-center text-center">
            <span>
              <UserOutlined className="text-16" />
            </span>
            <span>
              {employeeName}{' '}
              <span className="text-inactive">({employeeId})</span>
            </span>
          </div>
          {status.label === 'ทำ OT' ? (
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center gap-10">
                <span className="w-[100px] text-nowrap">จำนวนนาที OT x1.5</span>
                <Input
                  className="w-[80px] h-[32px]"
                  suffix={<span className="text-disable">นาที</span>}
                />
              </div>
              <div className="flex justify-between items-center gap-10">
                <span className="w-[100px] text-nowrap">จำนวนนาที OT x2</span>
                <Input
                  className="w-[80px] h-[32px]"
                  suffix={<span className="text-disable">นาที</span>}
                />
              </div>
              <div className="flex justify-between items-center gap-10">
                <span className="w-[100px] text-nowrap">จำนวนนาที OT x3</span>
                <Input
                  className="w-[80px] h-[32px]"
                  suffix={<span className="text-disable">นาที</span>}
                />
              </div>
              <CustomButton
                theme="primary"
                className="w-[67px] h-[30px] place-self-end"
                onClick={handleSave}
              >
                บันทึก
              </CustomButton>
            </div>
          ) : status.label === 'มาสาย' ? (
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center gap-10">
                <span className="w-[100px] text-nowrap">มาสาย</span>
                <Input
                  className="w-[80px] h-[32px]"
                  suffix={<span className="text-disable">นาที</span>}
                />
              </div>
              <CustomButton
                theme="primary"
                className="w-[67px] h-[30px] place-self-end"
                onClick={handleSave}
              >
                บันทึก
              </CustomButton>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center gap-10">
                <span className="w-[100px] text-nowrap">มาสาย</span>
                <Input
                  className="w-[80px] h-[32px]"
                  suffix={<span className="text-disable">นาที</span>}
                />
              </div>
              <div className="flex justify-between items-center gap-10">
                <span className="w-[100px] text-nowrap">จำนวนนาที OT</span>
                <Input
                  className="w-[80px] h-[32px]"
                  suffix={<span className="text-disable">นาที</span>}
                />
              </div>
              <CustomButton
                theme="primary"
                className="w-[67px] h-[30px] place-self-end"
                onClick={handleSave}
              >
                บันทึก
              </CustomButton>
            </div>
          )}
        </div>
      }
    >
      {children}
    </Popover>
  );
};

export default EditLateOTPopover;
