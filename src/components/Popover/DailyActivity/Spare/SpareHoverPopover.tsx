import { FileTextOutlined, UserOutlined } from '@ant-design/icons';
import { Popover } from 'antd';
import { Dayjs } from 'dayjs';
import 'dayjs/locale/th';
import React from 'react';
import '../style.css';

interface SpareHoverPopoverProps {
  children: React.ReactNode;
  date: Dayjs;
  employeeName: string;
  employeeId: string;
  OT?: number;
  late?: number;
}

const SpareHoverPopover = ({
  children,
  date,
  employeeId,
  employeeName,
}: SpareHoverPopoverProps) => {
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

          <div className="flex gap-1">
            <FileTextOutlined />
            {/* change to real info after */}
            <div>
              <span>Jim Thompson (สยามพารากอน)</span>{' '}
              <span className="text-inactive">(55102-002)</span>
            </div>
          </div>

          {/* OT || late */}
          {(false || false) ?? (
            <div>
              {/* OT and Late */}
              {false && true && (
                <div className="flex flex-col">
                  <div className="flex justify-between">
                    <div className="flex gap-2 items-center">
                      <div className="relative w-3 h-3 half-circle"></div>
                      <span>มาสาย</span>
                    </div>
                    <span>15 นาที</span>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex gap-2 items-center">
                      <div className="bg-transparent w-3 h-3 rounded-full"></div>
                      <span>ทำ OT</span>
                    </div>
                    <span>15 นาที</span>
                  </div>
                </div>
              )}
              {false && (
                <div className="flex justify-between">
                  <div className="flex gap-2 items-center">
                    <div className="bg-[#FFD591] w-3 h-3 rounded-full"></div>
                    <span>มาสาย</span>
                  </div>
                  <span>15 นาที</span>
                </div>
              )}
              {false && (
                <div className="flex justify-between">
                  <div className="flex gap-2 items-center">
                    <div className="bg-[#91D5FF] w-3 h-3 rounded-full"></div>
                    <span>ทำ OT</span>
                  </div>
                  <span>120 นาที</span>
                </div>
              )}
            </div>
          )}
        </div>
      }
    >
      {children}
    </Popover>
  );
};

export default SpareHoverPopover;
