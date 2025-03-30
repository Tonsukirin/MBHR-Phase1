'use client';

import { CustomButton } from '@/components/Buttons';
import PositionTag from '@/components/Tags/PositionTag';
import { getAllEmployees } from '@/services/Employee';
import {
  ArrowLeftOutlined,
  FileTextOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Pagination, Spin, Table, TableColumnsType } from 'antd';
import Search from 'antd/es/input/Search';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import buddhistEra from 'dayjs/plugin/buddhistEra';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { EmployeeResponse } from '../../../../backend/employee';
dayjs.extend(buddhistEra);
dayjs.locale('th');

const EmployeeManagement = () => {
  const [tableData, setTableData] = useState<EmployeeResponse[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const router = useRouter();

  const columns: TableColumnsType<EmployeeResponse> = [
    {
      title: 'รหัส',
      dataIndex: 'shownEmployeeId',
      width: 85,
      sorter: (a: EmployeeResponse, b: EmployeeResponse) => {
        const [prefixA, suffixA] = a.shownEmployeeId.split('-').map(Number);
        const [prefixB, suffixB] = b.shownEmployeeId.split('-').map(Number);
        if (prefixA !== prefixB) {
          return prefixA - prefixB;
        }
        return suffixA - suffixB;
      },
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: 'ชื่อ-นามสกุล',
      render: (record: EmployeeResponse) => {
        return (
          <span>
            {record.name} {record.surname}
          </span>
        );
      },
    },
    {
      title: 'ชื่อเล่น',
      dataIndex: 'nickname',
      width: 80,
    },
    {
      title: 'แขวง, เขตที่อยู่อาศัย',
      width: 190,
      render: (record: EmployeeResponse) => {
        return (
          <span>
            {record.currentAddress.subDistrict},{' '}
            {record.currentAddress.district}
          </span>
        );
      },
    },
    {
      title: 'อายุ',
      dataIndex: 'age',
      width: 70,
      render: (value: number) => {
        return <div>{`${value} ปี`}</div>;
      },
    },
    {
      title: 'เบอร์โทร',
      dataIndex: 'phone',
      width: 160,
      render: (value: number | string) => {
        const phoneStr = String(value || '');
        const digits = phoneStr.replace(/\D/g, '');

        if (digits.length === 10) {
          return digits.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
        }

        return value;
      },
    },
    {
      title: 'ตำแหน่ง',
      dataIndex: 'position',
      width: 112,
      render: (position: string) => <PositionTag position={position} />,
    },
    {
      title: 'วันที่เริ่มงาน',
      dataIndex: 'startDate',
      width: 110,
      render: (DateValue: Date) => {
        const date = dayjs(DateValue);
        return date.format('DD/MM/BBBB');
      },
    },
    {
      title: 'สัญญาว่าจ้าง',
      width: 110,
      render: (value: number, record: EmployeeResponse) => {
        if (
          record.position !== 'FULLTIMEMAID' &&
          record.position !== 'SPAREMAID' &&
          record.position !== 'SPARECASH'
        )
          return <></>;
        else if (value === 0) {
          return (
            <div className="flex gap-2 text-[#000000] opacity-25">
              {'ไม่มีสัญญา'}
              <FileTextOutlined />
            </div>
          );
        }
        return (
          <div className="flex gap-2">
            {`ดูสัญญา`}
            <div className="text-[#000000] opacity-25">
              <FileTextOutlined />
            </div>
          </div>
        );
      },
    },
  ];

  const calculateRowsPerPage = () => {
    const container = document.getElementById('table-container');
    if (!container) return;

    const availableHeight = container.clientHeight - 220; // Offset for header, footer, etc.
    const rowHeight = 48; // antd default
    const rows = Math.floor(availableHeight / rowHeight);
    // Set a minimum of 5 rows
    setRowsPerPage(Math.max(rows, 3));
  };

  const fetchData = useCallback(
    async (page: number) => {
      setLoading(true);
      try {
        // const total = data.length;
        // const startIndex = (page - 1) * rowsPerPage;
        // const endIndex = startIndex + rowsPerPage;
        // const pageData = data.slice(startIndex, endIndex);

        // setTotalRows(total);
        // setTableData(pageData);

        const response = await getAllEmployees(page, rowsPerPage);
        console.log(response);
        setTableData(response.data.employees);
        setTotalRows(response.data.total);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setLoading(false);
    },
    [rowsPerPage]
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchData(page);
  };

  const handleRowClick = (record: any) => {
    router.push(`/dashboard/employee-management/${record.id}`);
  };

  useEffect(() => {
    calculateRowsPerPage();
    fetchData(currentPage);
    window.addEventListener('resize', calculateRowsPerPage);
    return () => {
      window.removeEventListener('resize', calculateRowsPerPage);
    };
  }, [rowsPerPage, currentPage, fetchData]);

  return (
    <div className="flex flex-col justify-between h-full">
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
                title: 'จัดการพนักงาน',
              },
              {
                title: 'รายชื่อพนักงาน',
              },
            ]}
          />
          <div className="flex gap-2">
            <ArrowLeftOutlined onClick={() => router.push('/dashboard')} />
            <span className="font-semibold text-20">รายชื่อพนักงาน</span>
          </div>

          <div className="flex gap-7">
            <Search
              placeholder="ค้นหาชื่อหน่วยงาน หรือ รหัสหน่วยงานที่นี่"
              size="large"
              allowClear
            />
            <CustomButton
              theme="primary"
              className="h-[38px]"
              icon={<PlusOutlined />}
              onClick={() =>
                router.push('/dashboard/employee-management/employee-creation')
              }
            >
              เพิ่มพนักงานใหม่
            </CustomButton>
          </div>

          <div id="table-container" className="flex-1">
            <Table<EmployeeResponse>
              columns={columns}
              dataSource={tableData}
              pagination={false}
              rowKey="id"
              onRow={record => ({
                onClick: () => handleRowClick(record),
              })}
              scroll={{ y: 'calc(100% - 100px)' }} // Handle vertical scrolling if necessary
            />
          </div>

          {/* hard codded the position cus why not */}
          <div
            className="fixed bottom-0 left-0 right-0 py-4 px-8 flex mb-[27px] mr-[8px] justify-end"
            style={{ zIndex: 1000 }}
          >
            <Pagination
              showSizeChanger={false}
              current={currentPage}
              pageSize={rowsPerPage}
              total={totalRows}
              onChange={handlePageChange}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeManagement;
