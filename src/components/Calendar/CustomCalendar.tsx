import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Button, Calendar, Collapse, Divider, Popover, Select } from 'antd';
import th_TH from 'antd/lib/calendar/locale/th_TH';
import {
  endOfDay,
  endOfWeek,
  isWithinInterval,
  startOfDay,
  startOfWeek,
} from 'date-fns';
import dayjs, { Dayjs } from 'dayjs';
import { useState } from 'react';
import {
  EmployeeContractSalary,
  PayRateContractSalary,
} from '../../../backend/contractSalary';
import './style.css';
import Image from 'next/image';

interface CustomCalendarProps {
  employee: EmployeeContractSalary[];
  payRate: PayRateContractSalary[];
}

function sortByStartDate<T extends { startDate: Date }>(intervals: T[]): T[] {
  return [...intervals].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );
}

function processIntervals<T extends { startDate: Date; endDate: Date }>(
  intervals: T[]
): T[] {
  const sortedIntervals = [...intervals].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  const result: T[] = [];

  for (let i = 0; i < sortedIntervals.length; i++) {
    const current = sortedIntervals[i];

    if (result.length === 0) {
      result.push(current);
      continue;
    }

    const last = result[result.length - 1];

    if (current.startDate <= last.endDate) {
      if (current.startDate > last.startDate) {
        last.endDate = new Date(current.startDate.getTime() - 1);
        result.push(current);
      } else if (current.startDate === last.startDate) {
        result[result.length - 1] = current;
      } else {
        last.endDate = new Date(
          Math.max(last.endDate.getTime(), current.endDate.getTime())
        );
      }
    } else {
      result.push(current);
    }
  }

  return result;
}

const CustomCalendar = ({ employee, payRate }: CustomCalendarProps) => {
  const [open, setOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number>();
  const scenarioInformation = sortByStartDate(payRate);
  const employeeInformation = sortByStartDate(employee);
  const processedPayRates = processIntervals(scenarioInformation);
  const processedEmployees = processIntervals(employeeInformation);
  console.log('Processed PayRates:', processedPayRates);
  console.log('Processed Employees:', processedEmployees);

  const contractStartDate = dayjs(scenarioInformation[0].startDate);
  //will use current day later when fully functioning
  const [currentDate, setCurrentDate] = useState<Dayjs>(
    dayjs(contractStartDate)
  );

  const renderHeader = ({
    value,
    onChange,
  }: {
    value: Dayjs;
    onChange: (date: Dayjs) => void;
  }) => {
    setSelectedYear(value.year);
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

    const startYear = contractStartDate.year();
    const yearOptions = Array.from({ length: 11 }, (_, i) => startYear + i);

    const monthIndex = value.month();
    const monthName = months[monthIndex];

    const handleMonthClick = (month: number) => {
      if (selectedYear) {
        if (
          selectedYear < contractStartDate.year() ||
          (selectedYear === contractStartDate.year() &&
            month < contractStartDate.month())
        ) {
          return;
        }

        const newDate = dayjs().year(selectedYear).month(month);
        onChange(newDate);
        setCurrentDate(newDate);
        setOpen(false);
      }
    };

    const goToPreviousMonth = () => {
      const newDate = value.subtract(1, 'month');
      onChange(newDate);
      setCurrentDate(newDate);
      setSelectedYear(newDate.year());
    };

    const goToNextMonth = () => {
      const newDate = value.add(1, 'month');
      onChange(newDate);
      setCurrentDate(newDate);
      setSelectedYear(newDate.year());
    };

    const disablePrevious = !value.isAfter(contractStartDate, 'month');

    return (
      <div className="flex gap-3 items-center mb-4 justify-end">
        <Button
          shape="circle"
          size="small"
          disabled={disablePrevious}
          className={` ${
            disablePrevious
              ? 'text-[#B0B0B0] bg-[#F5F5F5] hover:bg-[#E0E0E0]'
              : 'text-[#F9991E] bg-[#FFF8E8] hover:bg-[#FFE4C2]'
          } border-none shadow-none`}
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
                  onChange={setSelectedYear}
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
                  if (selectedYear) {
                    const isDisabled =
                      selectedYear < contractStartDate.year() ||
                      (selectedYear === contractStartDate.year() &&
                        index < contractStartDate.month());

                    // Apply highlight only if the selected year matches the displayed year
                    const isHighlighted =
                      index === monthIndex && selectedYear === value.year();

                    return (
                      <div
                        key={index}
                        className={`text-center cursor-pointer py-[17px] rounded-md ${
                          isHighlighted ? 'text-[#F9991E]' : 'text-[#404040]'
                        } ${isDisabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                        onClick={() => !isDisabled && handleMonthClick(index)}
                      >
                        {name}
                      </div>
                    );
                  }
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
            {`${monthName} ${selectedYear ? selectedYear + 543 : 0}`}
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

  const getPayRateStyle = (payRate: PayRateContractSalary) => {
    if (payRate.salaryType === 'TEMPORARY') return 'bg-[#4FC4F4]/40';
    if (payRate.monthlyRate !== 8500 && payRate.dailyRate !== 385)
      return 'bg-[#F48625]/80';
    return 'bg-[#F9991E]/60';
  };

  const renderCell = (date: Dayjs) => {
    const dayStart = startOfDay(date.toDate());
    const calendarStartDate = startOfWeek(
      startOfDay(currentDate.startOf('month').toDate())
    );

    // Pay Rate Bars
    const payRateBars = processedPayRates
      .filter(payRate => {
        const startDate = new Date(payRate.startDate);
        const endDate = new Date(payRate.endDate);
        return isWithinInterval(dayStart, {
          start: startOfDay(startDate),
          end: endOfDay(endDate),
        });
      })
      .map(payRate => {
        const startDate = new Date(payRate.startDate);
        const endDate = new Date(payRate.endDate);

        const weekStart = startOfWeek(dayStart);
        const weekEnd = startOfDay(endOfWeek(dayStart));

        const isFirstInRange =
          dayStart.getTime() === startOfDay(startDate).getTime() ||
          dayStart.getTime() === weekStart.getTime();

        const isLastInRange =
          dayStart.getTime() === startOfDay(endDate).getTime() ||
          dayStart.getTime() === weekEnd.getTime();

        const isMiddleInRange = !isFirstInRange && !isLastInRange;

        const showText =
          dayStart.getTime() === startOfDay(startDate).getTime() ||
          dayStart.getTime() === calendarStartDate.getTime();

        const style = getPayRateStyle(payRate);

        return (
          <div
            key={`payRate-${startDate}-${endDate}`}
            className={`payrate-bar ${style} text-white text-10 justify-center ${
              isFirstInRange && isLastInRange
                ? 'rounded-l-[4px] rounded-r-[4px] mx-2'
                : isFirstInRange
                ? 'rounded-l-[4px] rounded-r-none ml-2'
                : isLastInRange
                ? 'rounded-l-none rounded-r-[4px] mr-2'
                : isMiddleInRange
                ? 'rounded-none'
                : ''
            }`}
          >
            <span className="pl-4 overflow-visible text-nowrap">
              {showText
                ? payRate.payRateType === 'MONTHLY'
                  ? `รายเดือน (${payRate.monthlyRate} ฿ / เดือน)`
                  : `รายวัน (${payRate.dailyRate} ฿ / วัน)`
                : ''}
            </span>
          </div>
        );
      });

    // Employee Cards
    const employeeCards = processedEmployees
      .filter(employee => {
        const startDate = new Date(employee.startDate);
        const endDate = new Date(employee.endDate);
        return isWithinInterval(dayStart, {
          start: startOfDay(startDate),
          end: endOfDay(endDate),
        });
      })
      .map(employee => {
        const startDate = new Date(employee.startDate);
        const endDate = new Date(employee.endDate);

        const weekStart = startOfWeek(dayStart);
        const weekEnd = startOfDay(endOfWeek(dayStart));

        const isFirstInRange =
          dayStart.getTime() === startOfDay(startDate).getTime() ||
          dayStart.getTime() === weekStart.getTime();

        const isLastInRange =
          dayStart.getTime() === startOfDay(endDate).getTime() ||
          dayStart.getTime() === weekEnd.getTime();

        const isMiddleInRange = !isFirstInRange && !isLastInRange;

        // Show text only on the first day of the contract or the first day of the calendar page
        const showText =
          dayStart.getTime() === startOfDay(startDate).getTime() ||
          dayStart.getTime() === calendarStartDate.getTime();

        return (
          <div
            key={`employee-${employee.id}`}
            className={`flex employee-card bg-white items-center ${
              isFirstInRange && isLastInRange
                ? 'rounded-l-[4px] rounded-r-[4px] mx-2'
                : isFirstInRange
                ? 'rounded-l-[4px] rounded-r-none ml-2'
                : isLastInRange
                ? 'rounded-l-none rounded-r-[4px] mr-2'
                : isMiddleInRange
                ? 'rounded-none'
                : ''
            }`}
          >
            {showText && (
              <div className="flex pl-[11px] items-center gap-[10px]">
                <Image
                  src="/img/mb.svg"
                  alt={`Employee ${employee.employeeId}`}
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-10 font-regular overflow-hidden text-nowrap">
                  {employee.id}{' '}
                  <span className="text-inactive">
                    ({employee.employeeId || 'N/A'})
                  </span>
                </span>
              </div>
            )}
          </div>
        );
      });

    return (
      <div className="calendar-cell relative">
        <div className="relative min-h-[16px] mt-1 mb-4">{payRateBars}</div>
        <div className="relative min-h-[32px]">{employeeCards}</div>
      </div>
    );
  };

  return (
    <div className="flex gap-10 h-full">
      <div className="rounded-md max-w-[644px] flex-grow">
        <Calendar
          locale={th_TH}
          headerRender={props => renderHeader(props)}
          cellRender={date => renderCell(date)}
          value={currentDate}
        />
      </div>
      <div className="w-[405px] flex-grow max-h-[726px]">
        <Collapse
          activeKey={'1'}
          expandIcon={() => null}
          className="flex flex-col"
          items={[
            {
              key: '1',
              label: <div className="sticky">รายละเอียดการจ่ายเงินเดือน</div>,
              children: (
                <div className="max-h-[624px] overflow-y-scroll p-2 space-y-6">
                  {processedPayRates.map((payRate, index) => (
                    <div key={index}>
                      <div className="flex gap-4">
                        {/* Color Box */}
                        <div className="flex">
                          <div
                            className={`rounded-[4px] w-[24px] h-[16px] ${
                              payRate.salaryType === 'TEMPORARY'
                                ? 'bg-[#9BDFFE]'
                                : payRate.monthlyRate !== 8500 &&
                                  payRate.dailyRate !== 385
                                ? 'bg-[#F48625]/80'
                                : 'bg-[#F9991E]/60'
                            }`}
                          />
                        </div>

                        <div className="flex-1 space-y-4 w-full">
                          {/* Date Range and PayRate Details */}
                          <div className="flex gap-4">
                            <div className="flex">
                              <span
                                className={`text-[14px] font-medium w-[80px] ${
                                  payRate.salaryType === 'TEMPORARY'
                                    ? 'text-[#4FC4F4]'
                                    : payRate.monthlyRate !== 8500 &&
                                      payRate.dailyRate !== 385
                                    ? 'text-[#F48625]'
                                    : 'text-[#F9991E]'
                                }`}
                              >{`วันที่ ${new Date(
                                payRate.startDate
                              ).getDate()} - ${new Date(
                                payRate.endDate
                              ).getDate()}`}</span>
                            </div>
                            <div className="space-y-2 w-full">
                              <div className="flex justify-between items">
                                <span className="text-[14px]">
                                  จันทร์ - ศุกร์
                                </span>
                                <span className="text-inactive text-[14px]">
                                  {payRate.payRateType === 'MONTHLY'
                                    ? `${payRate.monthlyRate} ฿ / เดือน`
                                    : `${payRate.dailyRate} ฿ / วัน`}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-[#404040] text-[14px]">
                                  เสาร์
                                </span>
                                <span className="text-inactive text-[14px]">
                                  250 ฿ / วัน
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* OT Rates */}
                          <div className="flex gap-4 w-full">
                            <span className="text-inactive text-[14px] w-[80px]">
                              การจ่าย OT
                            </span>
                            <div className="space-y-4 text-[14px]">
                              <div>
                                1.5 ={' '}
                                <span className="text-inactive">
                                  {payRate.otRates.rate1} ฿
                                </span>
                              </div>
                              <div>
                                2 ={' '}
                                <span className="text-inactive">
                                  {' '}
                                  {payRate.otRates.rate2} ฿
                                </span>
                              </div>
                              <div>
                                3 ={' '}
                                <span className="text-inactive">
                                  {payRate.otRates.rate3} ฿
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Divider */}
                      {index < processedPayRates.length - 1 && <Divider />}
                    </div>
                  ))}
                </div>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
};

export default CustomCalendar;
