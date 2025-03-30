import { Popover } from 'antd';
import React, { useState } from 'react';
import '../style.css';

interface HolidayConfirmPopoverProps {
  isHoliday: boolean;
  children: React.ReactNode;
  innerPopover: React.ReactNode;
}

const HolidayConfirmPopover: React.FC<HolidayConfirmPopoverProps> = ({
  isHoliday,
  children,
  innerPopover,
}) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [confirmed, setConfirmed] = useState<boolean>(false);

  if (!isHoliday) {
    return <>{children}</>;
  }

  return (
    <Popover
      trigger="click"
      open={visible}
      onOpenChange={newVisible => setVisible(newVisible)}
      content={
        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="px-2 py-1 bg-gray-200 rounded"
            onClick={() => {
              setVisible(false);
              setConfirmed(false);
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-2 py-1 bg-blue-500 text-white rounded"
            onClick={() => {
              setConfirmed(true);
              setVisible(false);
            }}
          >
            Confirm
          </button>
        </div>
      }
    >
      <div
        onClick={() => {
          setVisible(true);
        }}
      >
        {confirmed ? innerPopover : children}
      </div>
    </Popover>
  );
};
export default HolidayConfirmPopover;
