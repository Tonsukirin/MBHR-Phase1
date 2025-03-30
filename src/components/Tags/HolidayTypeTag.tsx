import { Tag } from 'antd';
import React from 'react';

interface HolidayTypeTagProps {
  holidayType: string;
}

const positionStyles: {
  [key: string]: { background: string; border: string; color: string };
} = {
  'ตาม MB': {
    background: '#E6F7FF',
    border: '1px solid #91D5FF',
    color: '#1890ff',
  },
  ตามลูกค้า: {
    background: '#FFF7E6',
    border: '1px solid #FFD591',
    color: '#FA8C16',
  },
};

const HolidayTypeTag: React.FC<HolidayTypeTagProps> = ({ holidayType }) => {
  const style = positionStyles[holidayType] || {
    background: 'white',
    border: '1px solid #d9d9d9',
    color: '#000',
  };

  return (
    <Tag
      style={{
        background: style.background,
        border: style.border,
        color: style.color,
      }}
      className="rounded-2 px-2 py-[1px] text-12 leading-5 font-normal h-[22px]"
    >
      {holidayType}
    </Tag>
  );
};

export default HolidayTypeTag;
