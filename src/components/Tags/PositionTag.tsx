import { Tag } from 'antd';
import React from 'react';

interface PositionTagProps {
  position: string;
}

const positionStyles: {
  [key: string]: { background: string; border: string; color: string };
} = {
  ประจำ: {
    background: '#E6F7FF',
    border: '1px solid #91D5FF',
    color: '#1890ff',
  },
  สแปร์: {
    background: '#FFF7E6',
    border: '1px solid #FFD591',
    color: '#FA8C16',
  },
  สายตรวจ: {
    background: '#F7EDFF',
    border: '1px solid #D3ADF7',
    color: '#722ED1',
  },
  ฝ่ายขาย: {
    background: '#F6FFED',
    border: '1px solid #B7EB8F',
    color: '#1ECC5E',
  },
  ฝ่ายบุคคล: {
    background: '#E6FFFB',
    border: '1px solid #87E8DE',
    color: '#13C2C2',
  },
  ธุรการ: {
    background: '#FFF0F6',
    border: '1px solid #FFADD2',
    color: '#F759AB',
  },
  ฝ่ายจัดส่ง: {
    background: '#FFF2E8',
    border: '1px solid #FFBB96',
    color: '#FA541C',
  },
};

const positionMapping: { [key: string]: string } = {
  FULLTIMEMAID: 'ประจำ',
  SPAREMAID: 'สแปร์',
  SPARECASH: 'สแปร์',
  INSPECTOR: 'สายตรวจ',
  SALES: 'ฝ่ายขาย',
  HR: 'ฝ่ายบุคคล',
  STOCK: 'ธุรการ',
  DELIVERY: 'ฝ่ายจัดส่ง',
};

const PositionTag: React.FC<PositionTagProps> = ({ position }) => {
  const mappedPosition = positionMapping[position] || position;

  const style = positionStyles[mappedPosition] || {
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
      {mappedPosition}
    </Tag>
  );
};

export default PositionTag;
