'use client';

import { CustomButton } from '@/components/Buttons';
import { CustomCalendar } from '@/components/Calendar';
import { SalaryAdjustModal } from '@/components/Modal';
import { getClientOverview } from '@/services/api';
import {
  ArrowLeftOutlined,
  EditOutlined,
  StopOutlined,
  SwapOutlined,
  TransactionOutlined,
  UserAddOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Button, Card, Divider, Spin } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import buddhistEra from 'dayjs/plugin/buddhistEra';
import isBetween from 'dayjs/plugin/isBetween';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  employeeScenario4,
  payrateScenario4,
} from '../../../../../backend/contractSalary';
import './style.css';

dayjs.extend(isBetween);
dayjs.extend(buddhistEra);
dayjs.locale('th');

// MOCK WAITING FOR API AND TYPE
interface MaidShift {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
}

const tempMaidInfo: MaidShift[] = [
  {
    id: '1-54008',
    name: 'นางส้ม มะละกอ',
    startDate: '2025-01-01T00:00:00.000Z',
    endDate: '2025-01-14T00:00:00.000Z',
  },
  {
    id: '1-54009',
    name: 'นายจอห์น สมิธ',
    startDate: '2025-01-15T00:00:00.000Z',
    endDate: '2025-01-18T00:00:00.000Z',
  },
  {
    id: '',
    name: '',
    startDate: '2025-01-19T00:00:00.000Z',
    endDate: '2025-01-22T00:00:00.000Z',
  },
  // {
  //   name: 'นางสาวพรเพ็ญ อินทร์บุญ (1-54010)',
  //   startDate: '2025-01-19T00:00:00.000Z',
  //   endDate: '2025-01-22T00:00:00.000Z',
  // },
];

const tempImages = [
  'https://picsum.photos/400/268?random=1',
  'https://picsum.photos/400/268?random=2',
  'https://picsum.photos/400/268?random=3',
  'https://picsum.photos/400/268?random=4',
  'https://picsum.photos/400/268?random=5',
];

const ContractOverview = ({ params }: { params: { id: string } }) => {
  const id = params.id;
  const [loading, setLoading] = useState(false);
  const [clientData, setClientData] = useState<any>(null);
  const [salaryAdjustModalOpen, setSalaryAdjustModalOpen] = useState(false);
  const router = useRouter();

  const clientFullAddress = () => {
    return `${clientData?.address?.houseNumber} ${clientData?.address?.village} ${clientData?.address?.alley} ${clientData?.address?.street}, ${clientData?.address?.subDistrict}, ${clientData?.address?.district}, ${clientData?.address?.province} ${clientData?.address?.postalCode}`;
  };

  const isCurrentCard = (startDate: string, endDate: string) => {
    const currentDate = dayjs();
    const start = dayjs(startDate);
    const end = dayjs(endDate);
    return currentDate.isBetween(start, end, 'day', '[]');
  };

  const isPastCard = (endDate: string) => {
    const currentDate = dayjs();
    const end = dayjs(endDate);
    return currentDate.isAfter(end, 'day');
  };

  const handleSalaryAdjustModalSubmit = (values: any) => {
    console.log('Form Submitted:', values);
    setSalaryAdjustModalOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getClientOverview(id);
        setClientData(response?.data || {});
      } catch (error) {
        console.error('Error fetching client data: ', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  return (
    <div className="flex flex-col justify-between h-full">
      {loading ? (
        <Spin
          tip="Loading..."
          className="flex fixed top-0 left-20 w-full h-full justify-center items-center"
        />
      ) : (
        <div className="flex flex-col gap-6 h-full max-w-[1080px]">
          <Breadcrumb
            items={[
              { title: 'หน้าหลัก', href: '/dashboard' },
              { title: 'จัดการสัญญา' },
              { title: 'รายการสัญญางานจ้าง' },
              { title: `${clientData?.name || id}` },
            ]}
          />
          <div className="flex gap-2">
            <ArrowLeftOutlined
              onClick={() => router.push('/dashboard/contract-management')}
            />
            <span className="flex items-center w-full justify-between font-semibold text-20">
              <span className="flex gap-2">
                {clientData?.name || 'Test Client (สาขาทดลอง)'}
                <div className="font-normal text-[#6B6B6B]">
                  {' '}
                  ({clientData?.id || '55100 - 001'})
                </div>
              </span>
              <div className="flex gap-6 items-center">
                <CustomButton
                  icon={
                    <EditOutlined
                      className="cursor-pointer"
                      onClick={() => console.log('Edit Employee')}
                    />
                  }
                  theme="flat"
                  className="w-[118px] h-[38px]"
                >
                  แก้ไขข้อมูล
                </CustomButton>
                <Button
                  color="danger"
                  variant="filled"
                  shape="circle"
                  className="w-[38px] h-[38px]"
                >
                  <Image
                    alt="deleteIcon"
                    src={'/img/delete-icon.svg'}
                    width={14}
                    height={14}
                    className="object-contain"
                  />
                </Button>
              </div>
            </span>
          </div>

          <div
            className="w-full overflow-y-auto mt-[16px]"
            style={{
              maxHeight: 'calc(100vh - 140px)',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            <div className="flex-1 pb-10 max-w-[1080px]">
              <div className="flex flex-col gap-y-6">
                <div className="flex gap-[60px] w-full">
                  <section className="flex flex-col gap-6">
                    {/* Contract Information */}
                    <section className="flex flex-col gap-4">
                      <div className="flex gap-10">
                        <div className="flex flex-col gap-4 w-full  pl-[24px]">
                          <div className="flex gap-[40px]">
                            <div className="text-14 text-inactive min-w-[124px]">
                              รหัสสัญญางานจ้าง
                            </div>
                            <div>{clientData?.id || 'N/A'}</div>
                          </div>
                          <div className="flex gap-[40px]">
                            <div className="text-14 text-inactive min-w-[124px]">
                              ชื่อสัญญางานจ้าง
                            </div>
                            <div>{clientData?.industry || 'N/A'}</div>
                          </div>
                          <div className="flex gap-[40px]">
                            <div className="text-14 text-inactive min-w-[124px]">
                              พนักงานฝ่ายการตลาด
                            </div>
                            <div>{clientData?.industry || 'N/A'}</div>
                            <div className="text-14 text-inactive min-w-[80px] ml-[60px]">
                              หัวหน้าผู้ดูแล
                            </div>
                            <div>{clientData?.industry || 'N/A'}</div>
                          </div>
                          <div className="flex gap-[40px]">
                            <div className="text-14 text-inactive min-w-[124px]">
                              ช่วงเวลาสัญญา
                            </div>
                            <div>{clientData?.industry || 'N/A'}</div>
                          </div>
                          <div className="flex gap-[40px]">
                            <div className="text-14 text-inactive min-w-[124px]">
                              ที่อยู่ในการส่งเอกสาร
                            </div>
                            <div>{clientFullAddress() || 'N/A'}</div>
                          </div>
                        </div>
                      </div>
                    </section>
                  </section>
                </div>

                <Divider />

                <div className="flex flex-col gap-6">
                  <header className="text-16 font-semibold">
                    พนักงานแม่บ้านประจำ
                  </header>
                  <div className="flex gap-6">
                    {tempMaidInfo.map((maid, index) => (
                      <Card
                        key={index}
                        className={`w-[344px] h-[188px] ${
                          isCurrentCard(maid.startDate, maid.endDate)
                            ? 'current-card'
                            : ''
                        }`}
                        title={
                          <div className="flex justify-between items-center">
                            <span
                              className={`font-medium text-16 ${
                                isCurrentCard(maid.startDate, maid.endDate)
                                  ? 'text-[#F48625]'
                                  : ''
                              }`}
                            >
                              พนักงานในสัญญา{' '}
                              {isCurrentCard(maid.startDate, maid.endDate)
                                ? '(ปัจจุบัน)'
                                : isPastCard(maid.endDate)
                                ? '(อดีต)'
                                : ''}
                            </span>
                            <span>
                              {isPastCard(maid.endDate) ? (
                                <EditOutlined className="flex text-inactive text-20 cursor-pointer" />
                              ) : isCurrentCard(
                                  maid.startDate,
                                  maid.endDate
                                ) ? (
                                <span className="flex gap-4">
                                  <UserAddOutlined className="text-[#F48625] cursor-pointer text-20" />
                                  <StopOutlined className="text-[#FF4D4F] cursor-pointer text-20" />
                                </span>
                              ) : (
                                <UserAddOutlined className="flex cursor-pointer text-20" />
                              )}
                            </span>
                          </div>
                        }
                      >
                        <div className="flex flex-col gap-2">
                          {/* Employee Info */}
                          <div className="flex flex-col gap-2">
                            {/* Current Card Style */}
                            <span
                              className={`flex gap-2 items-center font-medium text-16 ${
                                isPastCard(maid.endDate) ? 'text-disable' : ''
                              }`}
                            >
                              <UserOutlined width={16} height={16} />
                              {maid.name || (
                                <span className="text-[#FF4D4F] font-regular">
                                  ยังไม่ได้มอบหมายพนักงาน
                                </span>
                              )}{' '}
                              <span className="font-regular">
                                {maid.id ? `(${maid.id})` : ''}
                              </span>
                            </span>
                            <span className="flex gap-4">
                              <p className="text-disable text-14 w-[72px]">
                                เริ่มงานวันที่
                              </p>
                              <p className="text-14">
                                {dayjs(maid.startDate)
                                  .locale('th')
                                  .format('D MMMM BBBB')}
                              </p>
                            </span>
                            <span className="flex gap-4">
                              <p className="text-disable text-14 w-[72px]">
                                สิ้นสุดงาน
                              </p>
                              <p className="text-14">
                                {dayjs(maid.endDate)
                                  .locale('th')
                                  .format('D MMMM BBBB')}
                              </p>
                            </span>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                <Divider />

                <div className="flex justify-between items-center">
                  <header className="text-16 font-semibold">
                    ปรับเงินเดือน
                  </header>
                  <div className="flex gap-6">
                    <CustomButton theme="secondary" icon={<SwapOutlined />}>
                      เปลี่ยนรูปแบบการจ่าย
                    </CustomButton>
                    <CustomButton
                      theme="primary"
                      icon={<TransactionOutlined />}
                      onClick={() => setSalaryAdjustModalOpen(true)}
                    >
                      ปรับเงินเดือน
                    </CustomButton>
                  </div>
                </div>

                <SalaryAdjustModal
                  open={salaryAdjustModalOpen}
                  onCancel={() => setSalaryAdjustModalOpen(false)}
                  onSubmit={handleSalaryAdjustModalSubmit}
                />
                <div className="custom-calendar">
                  <CustomCalendar
                    employee={employeeScenario4}
                    payRate={payrateScenario4}
                  />
                </div>

                <Divider />

                <div className="flex flex-col gap-6">
                  <header className="text-16 font-semibold">
                    ข้อมูลการเดินทาง
                  </header>
                  <section className="flex flex-col gap-6 ml-6">
                    <div className="flex gap-10">
                      <div className="flex flex-col gap-4 w-full">
                        <div className="flex gap-[40px]">
                          <div className="text-14 text-inactive min-w-[124px]">
                            วิธีการเดินทาง
                          </div>
                          <div className="min-w-[196px]">
                            {clientData?.industry || 'N/A'}
                          </div>
                          <div className="text-14 text-inactive min-w-[120px] ml-[40px]">
                            ระยะทางจากปากซอย
                          </div>
                          <div className="min-w-[137px]">
                            {clientData?.industry || 'N/A'}
                          </div>
                        </div>
                        <div className="flex gap-[40px]">
                          <div className="text-14 text-inactive min-w-[124px]">
                            ลิงก์ Google Maps
                          </div>
                          <div>{clientData?.industry || 'N/A'}</div>
                        </div>
                        <div className="flex flex-col gap-4">
                          <div className="text-14 text-inactive min-w-[136px]">
                            รูปภาพตึกอาคารเพิ่มเติม
                          </div>
                          <div className="flex flex-col gap-4">
                            <div className="flex overflow-x-auto gap-4">
                              {tempImages.map((src, index) => (
                                <div
                                  key={index}
                                  className="flex-shrink-0 h-[268px] w-[400px] bg-gray-100 rounded-lg overflow-hidden"
                                >
                                  <Image
                                    src={src}
                                    alt={`img-${index}`}
                                    height={268}
                                    width={400}
                                    className="object-cover w-full h-full"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>

                <Divider />

                <div className="flex flex-col gap-6 pb-16">
                  <header className="text-16 font-semibold">กะการทำงาน</header>
                  <section className="flex flex-col gap-6 ml-6">
                    <div className="flex gap-10">
                      <div className="flex flex-col gap-4 w-full">
                        <div className="flex gap-[40px]">
                          <div className="text-14 text-inactive min-w-[120px]">
                            วันหยุดนักขัตฤกษ์
                          </div>
                          <div className="min-w-[196px]">
                            {clientData?.industry || 'N/A'}
                          </div>
                        </div>
                        <div className="flex gap-[40px]">
                          <div className="text-14 text-inactive min-w-[120px]">
                            กะการทำงานหลัก
                          </div>
                          <div>{clientData?.industry || 'N/A'}</div>
                        </div>
                        <div className="flex gap-[40px]">
                          <div className="text-14 text-inactive min-w-[120px]">
                            กะการทำงานเสริม
                          </div>
                          <div>{clientData?.id || 'N/A'}</div>
                        </div>
                        <div className="flex gap-[40px]">
                          <div className="text-14 text-inactive min-w-[120px]">
                            กะการทำงานเสริม 2
                          </div>
                          <div>{clientData?.id || 'N/A'}</div>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractOverview;
