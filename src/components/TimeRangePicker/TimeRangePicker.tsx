import { TimePicker } from 'antd';
import type { Dayjs } from 'dayjs';
import React, { useState } from 'react';
import './style.css';

const { RangePicker } = TimePicker;

interface TimeRangePickerProps {
  id?: string;
  value?: [Dayjs | null, Dayjs | null];
  onChange?: (value: [Dayjs | null, Dayjs | null]) => void;
}

const TimeRangePicker: React.FC<TimeRangePickerProps> = ({
  value,
  onChange,
}) => {
  const [pickerOpen, setPickerOpen] = useState(false);

  const handleRangeChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    if (onChange) {
      onChange(dates as [Dayjs | null, Dayjs | null]);
    }
  };

  const disableMinutes = () => {
    // Allow only 00 and 30 minutes
    const allowedMinutes = [0, 30];
    return Array.from({ length: 60 }, (_, i) => i).filter(
      minute => !allowedMinutes.includes(minute)
    );
  };

  const disabledTime = () => ({
    disabledMinutes: disableMinutes,
  });

  return (
    <RangePicker
      placeholder={['7.00 น.', '16.00 น.']}
      format="HH:mm น."
      value={value}
      onChange={handleRangeChange}
      open={pickerOpen}
      onOpenChange={open => setPickerOpen(open)}
      disabledTime={disabledTime}
      className={`${value && value[0] && value[1] ? 'has-values' : ''}`}
      popupClassName="custom-time-range-picker"
    />
  );
};

export default TimeRangePicker;
