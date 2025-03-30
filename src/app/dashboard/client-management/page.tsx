'use client';

import { CustomButton } from '@/components/Buttons';
import { AddClientModal } from '@/components/Modal';
import { addClient, getAllClient } from '@/services/Client';
import {
  ArrowLeftOutlined,
  FileTextOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Pagination, Spin, Table, TableColumnsType } from 'antd';
import Search from 'antd/es/input/Search';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  ClientsResponse,
  CreateClientRequest,
} from '../../../../backend/Client/client';
import './style.css';

const columns: TableColumnsType<ClientsResponse> = [
  {
    title: 'รหัสหน่วยงาน',
    dataIndex: 'shownClientId',
    sorter: (a: ClientsResponse, b: ClientsResponse) => {
      const [prefixA, suffixA] = a.shownClientId.split('-').map(Number);
      const [prefixB, suffixB] = b.shownClientId.split('-').map(Number);
      if (prefixA !== prefixB) {
        return prefixA - prefixB;
      }
      return suffixA - suffixB;
    },
    render: (text: string) => <span>{text}</span>,
    width: 132,
  },
  {
    title: 'ชื่อหน่วยงาน',
    dataIndex: 'clientName',
  },
  {
    title: 'ที่อยู่หน่วยงาน',
    dataIndex: 'location',
    width: 200,
  },
  {
    title: 'ชื่อลูกค้าที่ติดต่อ',
    dataIndex: 'contactName',
    width: 160,
  },
  {
    title: 'เบอร์โทรมือถือ',
    dataIndex: 'phoneNum',
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
    title: 'สัญญาว่าจ้าง',
    dataIndex: 'contractAmount',
    width: 124,
    render: (value: number) => {
      if (value === 0) {
        return (
          <div className="flex gap-2 text-[#000000] opacity-25">
            {'ไม่มีสัญญา'}
            <FileTextOutlined />
          </div>
        );
      }
      return (
        <div className="flex gap-2">
          {`ดูสัญญา (${value})`}
          <div className="text-[#000000] opacity-25">
            <FileTextOutlined />
          </div>
        </div>
      );
    },
  },
];

const ClientManagement = () => {
  const [tableData, setTableData] = useState<ClientsResponse[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();

  const calculateRowsPerPage = () => {
    const container = document.getElementById('table-container');
    if (!container) return 5;

    const availableHeight = container.clientHeight - 220;
    const rowHeight = 48;
    const rows = Math.floor(availableHeight / rowHeight);
    return Math.max(rows, 5);
  };

  //real API
  const fetchClients = async (page: number, limit: number) => {
    setLoading(true);
    try {
      const response = await getAllClient(page, limit);
      const { clients, total } = response.data;

      const transformedData = clients.map((client: ClientsResponse) => ({
        ...client,
        id: client.id,
        clientName: client.name,
        location: `${
          client.address.building === null
            ? client.address.subDistrict + ', ' + client.address.district
            : client.address.building + ', ' + client.address.district
        }`,
        contactName: client.contactPerson[0]?.name || 'N/A',
        phoneNum: client.contactPerson[0]?.phone || 'N/A',
        contractAmount: Array.isArray(client.clientContract)
          ? client.clientContract.length
          : 0,
      }));
      setTableData(transformedData);
      setTotalRows(total);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchClients(page, rowsPerPage || 10);
  };

  const handleModalSubmit = async (values: CreateClientRequest) => {
    const response = await addClient(values);
    console.log('Form Submitted:', response);
    await fetchClients(1, rowsPerPage || 10);
    setModalOpen(false);
  };

  const handleRowClick = (record: ClientsResponse) => {
    router.push(`/dashboard/client-management/${record.id}`);
  };

  //on mount useEffect
  useEffect(() => {
    // Calculate rowsPerPage on first render
    const initialRowsPerPage = calculateRowsPerPage();
    setRowsPerPage(initialRowsPerPage);

    // Fetch only after rowsPerPage is set
    if (initialRowsPerPage) {
      fetchClients(currentPage, initialRowsPerPage);
    }

    // Recalculate on window resize
    const handleResize = () => {
      const newRowsPerPage = calculateRowsPerPage();
      setRowsPerPage(newRowsPerPage);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [currentPage]);

  useEffect(() => {
    if (rowsPerPage !== null) {
      fetchClients(currentPage, rowsPerPage);
    }
  }, [currentPage, rowsPerPage]);

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
                title: 'จัดการหน่วยงาน',
              },
              {
                title: 'รายชื่อหน่วยงาน',
              },
            ]}
          />
          <div className="flex gap-2">
            <ArrowLeftOutlined onClick={() => router.push('/dashboard')} />
            <span className="font-semibold text-20">รายชื่อหน่วยงาน</span>
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
              onClick={() => setModalOpen(true)}
            >
              สร้างรายการใหม่
            </CustomButton>
            <AddClientModal
              open={modalOpen}
              onCancel={() => setModalOpen(false)}
              onSubmit={handleModalSubmit}
            />
          </div>

          <div id="table-container" className="flex-1">
            <Table<ClientsResponse>
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
              pageSize={rowsPerPage || 10}
              total={totalRows}
              onChange={handlePageChange}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientManagement;
