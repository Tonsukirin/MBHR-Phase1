import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Button, Popover, Select } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useState } from 'react';

type MonthSelectorProps = {
  value: Dayjs;
  onChange: (date: Dayjs) => void;
};

export const MonthSelector = ({ value, onChange }: MonthSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(value.year());
  const months = [
    'มกราคม',
    'กุมภาพันธ์',
    'มีนาคม',
    'เมษายน',
    'พฤษภาคม',
    'มิถุนายน',
    'กรกฎาคม',
    'สิงหาคม',
    'กันยายน',
    'ตุลาคม',
    'พฤศจิกายน',
    'ธันวาคม',
  ];

  // Always start from the current year.
  const startYear = dayjs().year();
  const yearOptions = Array.from({ length: 11 }, (_, i) => startYear + i);

  const monthIndex = value.month();
  const monthName = months[monthIndex];

  const handleMonthClick = (month: number) => {
    const newDate = value.year(selectedYear).month(month);
    onChange(newDate);
    setOpen(false);
  };

  const goToPreviousMonth = () => {
    const newDate = value.subtract(1, 'month');
    onChange(newDate);
    setSelectedYear(newDate.year());
  };

  const goToNextMonth = () => {
    const newDate = value.add(1, 'month');
    onChange(newDate);
    setSelectedYear(newDate.year());
  };

  return (
    <div className="flex gap-3 items-center justify-end">
      <Button
        shape="circle"
        size="small"
        // Removed disablePrevious logic—this button is always enabled.
        className="text-[#F9991E] bg-[#FFF8E8] hover:bg-[#FFE4C2] border-none shadow-none"
        icon={<LeftOutlined className="text-10" />}
        onClick={goToPreviousMonth}
      />

      <Popover
        overlayClassName="custom-calendar-popover"
        arrow={false}
        content={
          <div className="rounded-lg shadow-sm w-[300px] h-[312px]">
            <div className="flex justify-end bg-[#FFF7E6] px-2 py-3 rounded-t-lg h-[48px]">
              <Select
                className="w-[74px] h-[24px]"
                value={selectedYear}
                onChange={year => setSelectedYear(year)}
              >
                {yearOptions.map(year => (
                  <Select.Option key={year} value={year}>
                    {year + 543}
                  </Select.Option>
                ))}
              </Select>
            </div>
            <div className="grid grid-cols-3 gap-x-[6px] gap-y-2 m-2">
              {months.map((name, index) => {
                const isHighlighted =
                  index === monthIndex && selectedYear === value.year();

                return (
                  <div
                    key={index}
                    className={`text-center cursor-pointer py-[17px] rounded-md ${
                      isHighlighted ? 'text-[#F9991E]' : 'text-[#404040]'
                    }`}
                    onClick={() => handleMonthClick(index)}
                  >
                    {name}
                  </div>
                );
              })}
            </div>
          </div>
        }
        trigger="click"
        open={open}
        onOpenChange={setOpen}
      >
        <h1
          className="text-14 font-medium w-[102px] text-center cursor-pointer"
          onClick={() => setOpen(true)}
        >
          {`${monthName} ${selectedYear + 543}`}
        </h1>
      </Popover>

      <Button
        shape="circle"
        size="small"
        className="bg-[#FFF8E8] text-[#F9991E] border-none shadow-none hover:bg-[#FFE4C2]"
        icon={<RightOutlined className="text-10" />}
        onClick={goToNextMonth}
      />
    </div>
  );
};
