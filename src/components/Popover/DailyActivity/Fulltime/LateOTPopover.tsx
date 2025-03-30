import { UserOutlined } from '@ant-design/icons';
import { Popover } from 'antd';
import { Dayjs } from 'dayjs';
import 'dayjs/locale/th';
import React from 'react';
import '../style.css';

interface LateOTPopoverProps {
  children: React.ReactNode;
  date: Dayjs;
  employeeName: string;
  employeeId: string;
  OT?: number;
  late?: number;
}

const LateOTPopover = ({
  children,
  date,
  employeeId,
  employeeName,
}: LateOTPopoverProps) => {
  const thaiDate = date.locale('th');
  const formattedDate = `${thaiDate.format('D MMMM')} ${thaiDate.year() + 543}`;

  return (
    <Popover
      placement="left"
      title={formattedDate}
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
          <div>
            {true && (
              <div className="flex justify-between">
                <div className="flex gap-2 items-center">
                  <div className="bg-[#FFD591] w-3 h-3 rounded-full"></div>
                  <span>มาสาย</span>
                </div>
                <span>15 นาที</span>
              </div>
            )}
            {true && (
              <div className="flex justify-between">
                <div className="flex gap-2 items-center">
                  <div className="bg-[#91D5FF] w-3 h-3 rounded-full"></div>
                  <span>ทำ OT</span>
                </div>
                <span>120 นาที</span>
              </div>
            )}
          </div>
        </div>
      }
    >
      {children}
    </Popover>
  );
};

export default LateOTPopover;
