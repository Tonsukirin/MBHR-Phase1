'use client';

import { CustomButton } from '@/components/Buttons';
import { AddClientModal } from '@/components/Modal';
import { ContractShiftTag } from '@/components/Tags';
import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons';
import { Breadcrumb, Pagination, Spin, Table, TableColumnsType } from 'antd';
import Search from 'antd/es/input/Search';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { getAllContracts } from './services';
import './style.css';

interface DataType {
  name: string;
  startDate: string;
  shiftPattern: ShiftPattern;
  isSameAddress: boolean;
  employeeId: string;
}

interface ShiftPattern {
  workDay: string[];
  startTime: string;
  endTime: string;
}

const columns: TableColumnsType<DataType> = [
  {
    title: 'รหัสสัญญา',
    dataIndex: 'employeeId',
    sorter: {},
    width: 120,
  },
  {
    title: 'ชื่อสัญญางานจ้าง',
    dataIndex: 'name',
    width: 280,
  },
  {
    title: 'วันและเวลาทำงาน',
    dataIndex: 'shiftPattern',

    render: (shiftPattern: ShiftPattern) => {
      if (shiftPattern) {
        return (
          <div>
            <ContractShiftTag shiftPattern={shiftPattern} />
          </div>
        );
      }
    },
  },
  {
    title: 'หัวหน้าผู้ดูแล',
    dataIndex: 'supervisor',
    width: 105,
  },
  {
    title: 'พนักงาน',
    dataIndex: 'employeeId',
    width: 140,
  },
  {
    title: 'สถานะ',
    dataIndex: 'status',
    width: 108,
  },
];

const ContractManagement = () => {
  const [tableData, setTableData] = useState<DataType[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();

  const calculateRowsPerPage = () => {
    const container = document.getElementById('table-container');
    if (!container) return;

    const availableHeight = container.clientHeight - 200; // Adjust for header/footer
    const rowHeight = 48; // Ant Design default row height
    const rows = Math.floor(availableHeight / rowHeight);
    setRowsPerPage(Math.max(rows, 5));
  };

  const fetchData = useCallback(
    async (page: number) => {
      setLoading(true);
      try {
        const allContracts: DataType[] =
          (await getAllContracts()) as DataType[];

        // Pagination logic
        const startIndex = (page - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        const pageData = allContracts.slice(startIndex, endIndex);

        setTotalRows(allContracts.length);
        setTableData(pageData);
      } catch (error) {
        console.error('Error fetching contracts:', error);
      } finally {
        setLoading(false);
      }
    },
    [rowsPerPage]
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchData(page);
  };

  const handleModalSubmit = (values: any) => {
    console.log('Form Submitted:', values);
    setModalOpen(false);
    fetchData(currentPage);
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
              { title: 'หน้าหลัก', href: '/dashboard' },
              { title: 'จัดการหน่วยงาน' },
              { title: 'รายชื่อหน่วยงาน' },
            ]}
          />

          <div className="flex gap-2">
            <ArrowLeftOutlined onClick={() => router.push('/dashboard')} />
            <span className="font-semibold text-20">รายชื่อหน่วยงาน</span>
          </div>

          <div className="flex gap-7">
            <Search
              placeholder="ค้นหาชื่อสัญญา หรือ รหัสสัญญาที่นี่"
              allowClear
            />
            <CustomButton
              theme="primary"
              icon={<PlusOutlined />}
              onClick={() => setModalOpen(true)}
            >
              สร้างสัญญาใหม่
            </CustomButton>
            <AddClientModal
              open={modalOpen}
              onCancel={() => setModalOpen(false)}
              onSubmit={handleModalSubmit}
            />
          </div>

          <div id="table-container" className="flex-1">
            <Table<DataType>
              columns={columns}
              dataSource={tableData}
              pagination={false}
              rowKey="employeeId"
              scroll={{ y: 'calc(100% - 100px)' }}
            />
          </div>

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

export default ContractManagement;
