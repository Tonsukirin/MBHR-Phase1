import { Tag } from 'antd';
import React from 'react';

interface ShiftPattern {
  workDay: string[];
  startTime: string;
  endTime: string;
}

interface ContractShiftTagProps {
  shiftPattern: ShiftPattern;
}

// Mapping days to Thai labels
const dayLabels: { [key: string]: string } = {
  MON: 'จันทร์',
  TUE: 'อังคาร',
  WED: 'พุธ',
  THU: 'พฤหัส',
  FRI: 'ศุกร์',
  SAT: 'เสาร์',
  SUN: 'อาทิตย์',
};

// Function to determine if days are consecutive
const areDaysConsecutive = (days: string[]): boolean => {
  const order = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  const indices = days.map(day => order.indexOf(day)).sort((a, b) => a - b);
  return indices.every((val, i, arr) =>
    i === 0 ? true : val === arr[i - 1] + 1
  );
};

const ContractShiftTag: React.FC<ContractShiftTagProps> = ({
  shiftPattern,
}) => {
  const { workDay, startTime, endTime } = shiftPattern;

  let displayText = '';

  if (workDay.length === 7) {
    // Case: Monday to Sunday
    displayText = `ทุกวัน ${startTime} - ${endTime}`;
  } else if (workDay.length === 1) {
    // Case: Only one day
    displayText = `${dayLabels[workDay[0]]} ${startTime} - ${endTime}`;
  } else if (areDaysConsecutive(workDay)) {
    // Case: Consecutive days
    const startDay = dayLabels[workDay[0]];
    const endDay = dayLabels[workDay[workDay.length - 1]];
    displayText = `${startDay} - ${endDay} ${startTime} - ${endTime}`;
  } else {
    // Case: Non-consecutive days
    const days = workDay.map(day => dayLabels[day]).join(', ');
    displayText = `${days} ${startTime} - ${endTime}`;
  }

  return (
    <Tag
      style={{
        background: '#E6F7FF',
        border: '1px solid #91D5FF',
        color: '#1890ff',
      }}
      className="rounded-2 px-2 py-[1px] text-12 leading-5 font-normal h-[22px]"
    >
      {displayText}
    </Tag>
  );
};

export default ContractShiftTag;
