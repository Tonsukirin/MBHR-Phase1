'use client';

import { CustomButton } from '@/components/Buttons';
import { MonthSelector } from '@/components/Calendar/MonthSelector';
import {
  EditLateOTPopover,
  LateOTPopover,
} from '@/components/Popover/DailyActivity/Fulltime';
import {
  EditSparePopover,
  SpareHoverPopover,
} from '@/components/Popover/DailyActivity/Spare';
import {
  ArrowLeftOutlined,
  CheckOutlined,
  DownOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Popover, Spin, Table, TableColumnsType, Tabs } from 'antd';
import Search from 'antd/es/input/Search';
import dayjs, { Dayjs } from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { DailyActivityType, employees } from './mockData';
import './style.css';

dayjs.extend(weekday);

type StatusOption = {
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

type CustomDropdownProps = {
  selectedStatus: StatusOption | null;
  handleStatusSelect: (option: StatusOption) => void;
  isSpare?: boolean;
};

const statusColorMapping = {
  เข้าทำงาน: 'bg-[#1ECC5E]',
  มาสาย: 'bg-[#FFC069]',
  ไม่เข้าทำงาน: 'bg-[#FF7875]',
  'ทำ OT': 'bg-[#91D5FF]',
  'มาสาย & OT': 'bg-[#91D5FF]',
  อบรมหน้างาน: 'bg-[#B37FEB]',
  ลบสถานะ: 'bg-[#FF4D4F]',
};

const STATUS_OPTIONS: StatusOption[] = [
  {
    label: 'เข้าทำงาน',
    icon: <CheckOutlined className="text-green-600" />,
  },
  {
    label: 'มาสาย',
    icon: <div className="w-3 h-3 bg-[#FFD591] rounded-full" />,
  },
  {
    label: 'ไม่เข้าทำงาน',
    icon: <div className="w-3 h-3 bg-[#FF7875] rounded-full" />,
  },
  {
    label: 'ทำ OT',
    icon: <div className="w-3 h-3 bg-[#91D5FF] rounded-full" />,
  },
  {
    label: 'มาสาย & OT',
    icon: <div className="relative w-3 h-3 half-circle"></div>,
  },
  {
    label: 'อบรมหน้างาน',
    icon: <CheckOutlined className="text-purple-300" />,
  },
  {
    label: 'ลบสถานะ',
    icon: (
      <Image src="/img/delete-icon.svg" alt="delete" width={12} height={12} />
    ),
  },
];

const CustomDropdown = ({
  selectedStatus,
  handleStatusSelect,
  isSpare,
}: CustomDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const filteredOptions = isSpare
    ? STATUS_OPTIONS.filter(
        option =>
          option.label !== 'ไม่เข้าทำงาน' && option.label !== 'อบรมหน้างาน'
      )
    : STATUS_OPTIONS;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className={`text-white text-14 px-4 py-2 rounded-md flex items-center justify-start w-[120px] h-[38px] gap-2 ${
          selectedStatus
            ? statusColorMapping[selectedStatus.label] || 'bg-[#F9991E]'
            : 'bg-[#F9991E]'
        }`}
      >
        {selectedStatus ? (
          <div className="flex items-center gap-2 text-nowrap">
            <DownOutlined className="text-14" />{' '}
            <span>{selectedStatus.label}</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 w-full">
            <DownOutlined className="text-14" />
            <span className="text-14 overflow-auto text-nowrap">
              เลือกสถานะ
            </span>
          </div>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 py-1 w-[120px] bg-white shadow-xl rounded-sm z-50 custom-dropdown-style">
          {filteredOptions.map((option, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-[#F6F6F6]"
              onClick={() => {
                handleStatusSelect(option);
                setIsOpen(false);
              }}
            >
              <span>{option.icon}</span>
              <span className="text-14 font-regular text-nowrap">
                {option.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const generateFulTimeColumns = (
  currentDate: Dayjs,
  hoveredCell: { rowId: number; cellKey: string } | null,
  setHoveredCell: React.Dispatch<
    React.SetStateAction<{ rowId: number; cellKey: string } | null>
  >,
  selectedStatus: StatusOption | null,
  isEditing: boolean,
  editingCell: { rowId: number; cellKey: string } | null,
  handleCellClick: (rowId: number, cellKey: string) => void,
  handleEditSave: (rowId: number, cellKey: string, inputDate: any) => void,
  setEditingCell: React.Dispatch<
    React.SetStateAction<{ rowId: number; cellKey: string } | null>
  >,
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>,
  holidayConfirmed: boolean,
  setHolidayConfirmed: React.Dispatch<React.SetStateAction<boolean>>
): TableColumnsType<DailyActivityType> => {
  const extendedInputStatuses = ['มาสาย', 'ทำ OT', 'มาสาย & OT'];
  const startDate = dayjs()
    .year(currentDate.year())
    .month(currentDate.month())
    .date(21);
  const endDate = startDate.add(1, 'month').date(20);
  const totalDays = endDate.diff(startDate, 'day') + 1;

  const fixedColumns: TableColumnsType<DailyActivityType> = [
    {
      title: 'ลำดับ',
      dataIndex: 'id',
      width: 60,
      fixed: 'left',
      className: 'text-nowrap',
    },
    {
      title: 'พนักงาน',
      width: 160,
      fixed: 'left',
      className: 'text-nowrap',
      render: (_: unknown, record: DailyActivityType) => (
        <div>
          <span>{record.employeeName}</span>{' '}
          <span className="text-inactive">({record.employeeId})</span>
        </div>
      ),
    },
    {
      title: 'หน่วยงาน',
      dataIndex: 'company',
      width: 220,
      fixed: 'left',
      className: 'text-nowrap',
    },
  ];

  const dateColumns: TableColumnsType<DailyActivityType> = Array.from(
    { length: totalDays },
    (_, i) => {
      const date = startDate.add(i, 'day');
      const dayOfWeek = date.format('ddd').toUpperCase();
      //Real Format: employeeId_YYYYMMDD
      const cellKey = `fulltime_date_${date.format('YYYYMMDD')}`;
      console.log(cellKey);

      return {
        title: (
          <div
            className={`text-center ${
              dayOfWeek === 'SAT' || dayOfWeek === 'SUN' ? 'sat-sun-column' : ''
            }`}
          >
            <div>{date.format('D')}</div>
            {/* delete later, use for debug */}
            <div className="text-xs text-gray-500">{dayOfWeek}</div>
          </div>
        ),
        dataIndex: cellKey,
        width: 32,
        align: 'center',
        className: `date-column ${
          dayOfWeek === 'SAT' || dayOfWeek === 'SUN' ? 'sat-sun-column' : ''
        }`,
        onCell: (record: DailyActivityType) => {
          const isAssignedShift = record.workShift.includes(dayOfWeek);
          return {
            className: isAssignedShift ? '' : 'unassigned-shift',
          };
        },
        render: (value: string | undefined, record: DailyActivityType) => {
          const isAssignedShift = record.workShift.includes(dayOfWeek);
          const isHovered =
            hoveredCell &&
            hoveredCell.rowId === record.id &&
            hoveredCell.cellKey === cellKey;

          let displayIcon: React.ReactNode | null = null;
          if (isHovered && selectedStatus) {
            displayIcon = selectedStatus.icon;
          } else if (value) {
            const assingedOption = STATUS_OPTIONS.find(
              option => option.label === value
            );
            displayIcon = assingedOption ? assingedOption.icon : null;
          }

          const cellContent = (
            <div
              className={`h-[40px] w-[32px] flex justify-center items-center ${
                displayIcon ? 'hover:cursor-pointer' : ''
              }`}
              onMouseEnter={() => setHoveredCell({ rowId: record.id, cellKey })}
              onMouseLeave={() => setHoveredCell(null)}
              onClick={() => {
                if (
                  isAssignedShift &&
                  selectedStatus &&
                  !extendedInputStatuses.includes(selectedStatus.label)
                ) {
                  handleCellClick(record.id, cellKey);
                } else if (
                  selectedStatus &&
                  selectedStatus.label === 'ลบสถานะ'
                ) {
                  handleCellClick(record.id, cellKey);
                } else if (selectedStatus) {
                  setEditingCell({ rowId: record.id, cellKey });
                } else {
                  handleCellClick(record.id, cellKey);
                }
              }}
            >
              <span className={`${isEditing && isHovered ? 'opacity-30' : ''}`}>
                {displayIcon}
              </span>
            </div>
          );

          //Not editing state
          if (!isEditing) {
            if (!displayIcon) {
              return cellContent;
            }
            return (
              <LateOTPopover
                date={date}
                employeeId={record.employeeId}
                employeeName={record.employeeName}
              >
                {cellContent}
              </LateOTPopover>
            );
          }

          //editing state without extendedInputStatuses
          if (
            editingCell &&
            editingCell.rowId === record.id &&
            editingCell.cellKey === cellKey &&
            selectedStatus &&
            !extendedInputStatuses.includes(selectedStatus.label)
          ) {
            return (
              <Popover
                title="ยืนยันการเพิ่มข้อมูลในวันหยุด"
                placement="left"
                open={!holidayConfirmed}
                content={
                  <div className="flex flex-col gap-3">
                    <span>
                      วันที่เลือกเป็นวันหยุด ยืนยันเพิ่มข้อมูลหรือไม่?
                    </span>
                    <div className="flex gap-3 justify-end">
                      <CustomButton
                        className="w-[70px] h-[30px]"
                        theme="flat"
                        onClick={() => {
                          setEditingCell(null);
                          setHolidayConfirmed(false);
                        }}
                      >
                        ยกเลิก
                      </CustomButton>
                      <CustomButton
                        className="w-[70px] h-[30px]"
                        theme="primary"
                        onClick={() => {
                          handleCellClick(record.id, cellKey);
                          setEditingCell(null);
                          setHolidayConfirmed(false);
                        }}
                      >
                        ยืนยัน
                      </CustomButton>
                    </div>
                  </div>
                }
              >
                {cellContent}
              </Popover>
            );
          }

          //editing state with extendedInputStatuses
          //late, OT, both
          if (
            editingCell &&
            editingCell.rowId === record.id &&
            editingCell.cellKey === cellKey &&
            selectedStatus &&
            extendedInputStatuses.includes(selectedStatus.label)
          ) {
            if (!isAssignedShift) {
              if (!holidayConfirmed) {
                return (
                  <Popover
                    title="ยืนยันการเพิ่มข้อมูลในวันหยุด"
                    placement="left"
                    open={true}
                    content={
                      <div className="flex flex-col gap-3">
                        <span>
                          วันที่เลือกเป็นวันหยุด ยืนยันเพิ่มข้อมูลหรือไม่?
                        </span>
                        <div className="flex gap-3 justify-end">
                          <CustomButton
                            className="w-[70px] h-[30px]"
                            theme="flat"
                            onClick={() => {
                              setEditingCell(null);
                              setHolidayConfirmed(false);
                            }}
                          >
                            ยกเลิก
                          </CustomButton>
                          <CustomButton
                            className="w-[70px] h-[30px]"
                            theme="primary"
                            onClick={() => {
                              setHolidayConfirmed(true);
                            }}
                          >
                            ยืนยัน
                          </CustomButton>
                        </div>
                      </div>
                    }
                  >
                    {cellContent}
                  </Popover>
                );
              } else {
                return (
                  <EditLateOTPopover
                    date={date}
                    employeeId={record.employeeId}
                    employeeName={record.employeeName}
                    status={selectedStatus}
                    onSave={inputData => {
                      handleEditSave(record.id, cellKey, inputData);
                      setHolidayConfirmed(false);
                    }}
                    onCancel={() => {
                      setEditingCell(null);
                      setHolidayConfirmed(false);
                    }}
                  >
                    {cellContent}
                  </EditLateOTPopover>
                );
              }
            } else {
              return (
                <EditLateOTPopover
                  date={date}
                  employeeId={record.employeeId}
                  employeeName={record.employeeName}
                  status={selectedStatus}
                  onSave={inputData => {
                    handleEditSave(record.id, cellKey, inputData);
                  }}
                  onCancel={() => {
                    setEditingCell(null);
                  }}
                >
                  {cellContent}
                </EditLateOTPopover>
              );
            }
          }

          return cellContent;
        },
      } as TableColumnsType<DailyActivityType>[number];
    }
  );

  return [...fixedColumns, ...dateColumns];
};

const generateSpareColumns = (
  currentDate: Dayjs,
  hoveredCell: { rowId: number; cellKey: string } | null,
  setHoveredCell: React.Dispatch<
    React.SetStateAction<{ rowId: number; cellKey: string } | null>
  >,
  selectedStatus: StatusOption | null,
  isEditing: boolean,
  editingCell: { rowId: number; cellKey: string } | null,
  handleCellClick: (rowId: number, cellKey: string) => void,
  handleEditSave: (rowId: number, cellKey: string, inputDate: any) => void,
  setEditingCell: React.Dispatch<
    React.SetStateAction<{ rowId: number; cellKey: string } | null>
  >
): TableColumnsType<DailyActivityType> => {
  const startDate = dayjs()
    .year(currentDate.year())
    .month(currentDate.month())
    .date(21);
  const endDate = startDate.add(1, 'month').date(20);
  const totalDays = endDate.diff(startDate, 'day') + 1;

  const fixedColumns: TableColumnsType<DailyActivityType> = [
    {
      title: 'ลำดับ',
      dataIndex: 'id',
      width: 60,
      fixed: 'left',
      className: 'text-nowrap',
    },
    {
      title: 'พนักงาน',
      width: 160,
      fixed: 'left',
      className: 'text-nowrap',
      render: (_: unknown, record: DailyActivityType) => (
        <div>
          <span>{record.employeeName}</span>{' '}
          <span className="text-inactive">({record.employeeId})</span>
        </div>
      ),
    },
  ];

  const dateColumns: TableColumnsType<DailyActivityType> = Array.from(
    { length: totalDays },
    (_, i) => {
      const date = startDate.add(i, 'day');
      const dayOfWeek = date.format('ddd').toUpperCase();
      const cellKey = `spare_date_${date.format('YYYYMMDD')}`;

      return {
        title: (
          <div
            className={`text-center ${
              dayOfWeek === 'SAT' || dayOfWeek === 'SUN' ? 'sat-sun-column' : ''
            }`}
          >
            <div>{date.format('D')}</div>
            {/* delete later, use for debug */}
            <div className="text-xs text-gray-500">{dayOfWeek}</div>
          </div>
        ),
        dataIndex: cellKey,
        width: 32,
        align: 'center',
        className: `date-column ${
          dayOfWeek === 'SAT' || dayOfWeek === 'SUN' ? 'sat-sun-column' : ''
        }`,
        render: (value: string | undefined, record: DailyActivityType) => {
          const isHovered =
            hoveredCell &&
            hoveredCell.rowId === record.id &&
            hoveredCell.cellKey === cellKey;

          let displayIcon: React.ReactNode | null = null;
          if (isHovered && selectedStatus) {
            displayIcon = selectedStatus.icon;
          } else if (value) {
            const assingedOption = STATUS_OPTIONS.find(
              option => option.label === value
            );
            displayIcon = assingedOption ? assingedOption.icon : null;
          }

          const cellContent = (
            <div
              className={`h-[40px] w-[32px] flex justify-center items-center ${
                displayIcon ? 'hover:cursor-pointer' : ''
              }`}
              onMouseEnter={() => setHoveredCell({ rowId: record.id, cellKey })}
              onMouseLeave={() => setHoveredCell(null)}
              onClick={() => {
                if (selectedStatus && selectedStatus.label === 'ลบสถานะ') {
                  handleCellClick(record.id, cellKey);
                } else if (selectedStatus) {
                  setEditingCell({ rowId: record.id, cellKey });
                } else {
                  handleCellClick(record.id, cellKey);
                }
              }}
            >
              <span className={`${isEditing && isHovered ? 'opacity-30' : ''}`}>
                {displayIcon}
              </span>
            </div>
          );

          //Not editing state
          if (!isEditing) {
            if (!displayIcon) {
              return cellContent;
            }
            return (
              <SpareHoverPopover
                date={date}
                employeeId={record.employeeId}
                employeeName={record.employeeName}
              >
                {cellContent}
              </SpareHoverPopover>
            );
          }

          //editing state with extendedInputStatuses
          //late, OT, both
          if (
            editingCell &&
            editingCell.rowId === record.id &&
            editingCell.cellKey === cellKey &&
            selectedStatus
          ) {
            return (
              <EditSparePopover
                date={date}
                employeeId={record.employeeId}
                employeeName={record.employeeName}
                status={selectedStatus}
                onSave={inputData => {
                  handleEditSave(record.id, cellKey, inputData);
                }}
                onCancel={() => {
                  setEditingCell(null);
                }}
              >
                {cellContent}
              </EditSparePopover>
            );
          }

          return cellContent;
        },
      } as TableColumnsType<DailyActivityType>[number];
    }
  );

  return [...fixedColumns, ...dateColumns];
};

const DailyActivity = () => {
  const [tableData, setTableData] = useState<DailyActivityType[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<StatusOption | null>(
    null
  );
  const [hoveredCell, setHoveredCell] = useState<{
    rowId: number;
    cellKey: string;
  } | null>(null);
  const [currentDate, setCurrentDate] = useState<Dayjs>(dayjs());
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCell, setEditingCell] = useState<{
    rowId: number;
    cellKey: string;
  } | null>(null);
  const [holidayConfirmed, setHolidayConfirmed] = useState<boolean>(false);
  const router = useRouter();

  const handleStatusSelect = (option: StatusOption) => {
    setSelectedStatus(option);
    setIsEditing(true);
    console.log('enter editing mode: ', option.label);
  };

  const handleCellClick = (rowId: number, cellKey: string) => {
    if (!selectedStatus) return;
    setTableData(prev =>
      prev.map(row =>
        row.id === rowId
          ? {
              ...row,
              [cellKey]:
                selectedStatus.label === 'ลบสถานะ'
                  ? // undefined gotta be null or something in real API
                    undefined
                  : selectedStatus.label,
            }
          : row
      )
    );
  };

  const handleEditSave = (rowId: number, cellKey: string) => {
    setTableData(prev =>
      prev.map(row =>
        row.id === rowId ? { ...row, [cellKey]: selectedStatus?.label } : row
      )
    );
    setEditingCell(null);
  };

  const fetchClients = async () => {
    setLoading(true);
    try {
      const transformedData = employees.map(employee => ({
        id: employee.id,
        employeeName: employee.employeeName,
        employeeId: employee.employeeId,
        company: employee.company,
        workShift: employee.workShift,
      }));

      setTableData(transformedData);
    } catch (error) {
      console.error('Error fetching mock data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return (
    <div className="flex flex-col justify-between h-full w-full">
      {loading ? (
        <Spin
          tip="Loading..."
          className="flex justify-center items-center flex-1"
        />
      ) : (
        <div className="flex flex-col gap-6 h-full">
          <Breadcrumb
            items={[
              {
                title: 'หน้าหลัก',
                href: '/dashboard',
              },
              {
                title: 'บันทึกการเข้าทำงาน',
              },
            ]}
          />
          <div className="flex gap-2">
            <ArrowLeftOutlined onClick={() => router.push('/dashboard')} />
            <span className="font-semibold text-20">บันทึกการเข้าทำงาน</span>
          </div>

          <div className="flex flex-col gap-4 w-[74vw]">
            <div>
              <Tabs
                defaultActiveKey="1"
                size="large"
                items={[
                  {
                    key: '1',
                    label: 'พนักงานประจำ',
                    children: (
                      <div className="flex flex-col gap-4">
                        <div className="flex gap-4 items-center">
                          <Search
                            size="large"
                            placeholder="ค้นหาชื่อพนักงาน หรือ รหัสพนักงานที่นี่"
                            allowClear
                          />
                          <div className="flex items-center justify-self-center">
                            <MonthSelector
                              value={currentDate}
                              onChange={setCurrentDate}
                            />
                          </div>
                          <CustomDropdown
                            selectedStatus={selectedStatus}
                            handleStatusSelect={handleStatusSelect}
                          />
                        </div>

                        <div
                          id="fulltime-table"
                          className="flex-1 overflow-y-auto"
                        >
                          <Table<DailyActivityType>
                            columns={generateFulTimeColumns(
                              currentDate,
                              hoveredCell,
                              setHoveredCell,
                              selectedStatus,
                              isEditing,
                              editingCell,
                              handleCellClick,
                              handleEditSave,
                              setEditingCell,
                              setIsEditing,
                              holidayConfirmed,
                              setHolidayConfirmed
                            )}
                            dataSource={tableData}
                            pagination={false}
                            rowKey="id"
                            rowClassName={(_, index) =>
                              `custom-row ${
                                index % 2 === 0 ? 'even-row' : 'odd-row'
                              }`
                            }
                            scroll={{
                              y: 'calc(100vh - 400px)',
                              // x: 'max-content',
                            }}
                          />
                        </div>
                      </div>
                    ),
                  },
                  {
                    key: '2',
                    label: 'พนักงานสแปร์',
                    children: (
                      <div className="flex flex-col gap-4">
                        <div className="flex gap-4 items-center">
                          <Search
                            size="large"
                            placeholder="ค้นหาชื่อพนักงาน หรือ รหัสพนักงานที่นี่"
                            allowClear
                          />
                          <div className="flex items-center justify-self-center">
                            <MonthSelector
                              value={currentDate}
                              onChange={setCurrentDate}
                            />
                          </div>
                          <CustomDropdown
                            selectedStatus={selectedStatus}
                            handleStatusSelect={handleStatusSelect}
                            isSpare={true}
                          />
                        </div>
                        <div
                          id="spare-table"
                          className="flex-1 overflow-y-auto"
                        >
                          <Table<DailyActivityType>
                            columns={generateSpareColumns(
                              currentDate,
                              hoveredCell,
                              setHoveredCell,
                              selectedStatus,
                              isEditing,
                              editingCell,
                              handleCellClick,
                              handleEditSave,
                              setEditingCell
                            )}
                            dataSource={tableData}
                            pagination={false}
                            rowKey="id"
                            rowClassName={(_, index) =>
                              `custom-row ${
                                index % 2 === 0 ? 'even-row' : 'odd-row'
                              }`
                            }
                            scroll={{
                              y: 'calc(100vh - 400px)',
                              x: 'max-content',
                            }}
                          />
                        </div>
                      </div>
                    ),
                  },
                ]}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyActivity;
