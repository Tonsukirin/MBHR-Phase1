'use client';

import CustomButton from '@/components/Buttons/CustomButton';
import { deleteEmployee, getEmployeeById } from '@/services/Employee';
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons';
import {
  Breadcrumb,
  Button,
  Divider,
  Modal,
  Radio,
  Spin,
  Switch,
  Table,
} from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import buddhistEra from 'dayjs/plugin/buddhistEra';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { EmployeeResponse } from '../../../../../backend/employee';
import './style.css';
dayjs.extend(buddhistEra);
dayjs.locale('th');

const EmployeeOverview = ({ params }: { params: { id: number } }) => {
  const id = params.id;
  const [loading, setLoading] = useState(false);
  const [employeeData, setEmployeeData] = useState<EmployeeResponse | null>(
    null
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [addressHover, setAddressHover] = useState(false);
  const [maritalStatus, setMaritalStatus] = useState(
    employeeData?.additionalInfo.maritalStatus || 'single'
  );
  const router = useRouter();

  const employeeFullPermanentAddress = () => {
    if (!employeeData?.permanentAddress) return '';
    const {
      houseNumber,
      village,
      moo,
      alley,
      street,
      subDistrict,
      district,
      province,
      postalCode,
    } = employeeData.permanentAddress;

    const line1 = [houseNumber, village, moo, alley, street]
      .filter(Boolean)
      .join(' ');
    const line2 = [subDistrict, district, province, postalCode]
      .filter(Boolean)
      .join(', ');

    return [line1, line2].filter(Boolean).join(', ');
  };

  const employeeFullCurrentAddress = () => {
    if (!employeeData?.currentAddress) return '';
    const {
      houseNumber,
      village,
      moo,
      alley,
      street,
      subDistrict,
      district,
      province,
      postalCode,
    } = employeeData.currentAddress;

    const line1 = [houseNumber, village, moo, alley, street]
      .filter(Boolean)
      .join(' ');
    const line2 = [subDistrict, district, province, postalCode]
      .filter(Boolean)
      .join(', ');

    return [line1, line2].filter(Boolean).join(', ');
  };

  const formatPhoneNumber = (phone: string | undefined | null) => {
    if (!phone) return null; // Handle undefined or empty values
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
  };

  const formatThaiDate = (dateValue?: string | Date, isAge?: boolean) => {
    if (!dateValue) return <span>-</span>;

    const date = dayjs(dateValue);
    if (!date.isValid()) return <span>-</span>;

    const thaiDate = date.format('DD MMMM BBBB');
    const age = dayjs().diff(date, 'year');

    return (
      <span>
        {thaiDate}{' '}
        {isAge ? <span className="text-[#A3A3A3]">({age} ปี)</span> : null}
      </span>
    );
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

  const mapPosition = (position: string): string => {
    return positionMapping[position] || position;
  };

  const handleConfirmDelete = async () => {
    setIsModalVisible(false);
    console.log('delete employee: ', id);
    await deleteEmployee(id);
    router.push('/dashboard/employee-management');
  };

  const handleCancelDelete = () => {
    setIsModalVisible(false);
  };

  const workHistoryColumns = [
    {
      title: 'สถานที่ทำงาน',
      dataIndex: 'workPlace',
      key: 'workPlace',
      width: 200,
    },
    {
      title: 'ระยะเวลาจ้างงาน',
      dataIndex: 'contractDuration',
      key: 'contractDuration',
      width: 180,
    },
    {
      title: 'ลักษณะงาน',
      dataIndex: 'jobType',
      key: 'jobType',
      width: 140,
    },
    {
      title: 'เงินเดือน',
      dataIndex: 'salary',
      key: 'salary',
      width: 140,
    },
    {
      title: 'สาเหตุที่ออก',
      dataIndex: 'reason',
      key: 'reason',
      width: 200,
    },
  ];

  const fetchData = async () => {
    console.log('id is: ', id);
    setLoading(true);
    try {
      const response = await getEmployeeById(id);
      console.log(response);
      setEmployeeData(response.data);
    } catch (error) {
      console.error('Error fetching employee data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  return (
    <div className="flex flex-col h-full">
      {loading ? (
        <Spin
          tip="Loading..."
          className="flex fixed top-0 left-0 w-full h-full justify-center items-center"
        />
      ) : (
        <div className="flex flex-col gap-6 h-full">
          <Breadcrumb
            items={[
              { title: 'หน้าหลัก', href: '/dashboard' },
              {
                title: 'จัดการพนักงาน',
              },
              {
                title: 'รายชื่อพนักงาน',
                href: '/dashboard/employee-management',
              },
              { title: `${employeeData?.name || id}` },
            ]}
          />

          <div className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <ArrowLeftOutlined
                onClick={() => router.push('/dashboard/employee-management')}
              />
              <span className="font-semibold text-20">
                {employeeData?.name || 'N/A'}
                <span className="font-normal text-[#6B6B6B]">
                  {' '}
                  ({employeeData?.shownEmployeeId || 'N/A'})
                </span>
              </span>
            </div>
            <div className="flex gap-6 items-center">
              <CustomButton
                onClick={() =>
                  router.push(`/dashboard/employee-management/${id}/edit`)
                }
                icon={<EditOutlined className="cursor-pointer" />}
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
                onClick={() => setIsModalVisible(true)}
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
          </div>

          <div
            className="flex-1 pb-[76px] w-full overflow-y-auto"
            style={{
              maxHeight: 'calc(100vh - 140px)',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            <section className="flex gap-2 pb-6">
              <header className="text-16 font-semibold">ข้อมูลส่วนตัว</header>
            </section>
            <section className="flex gap-10 items-center">
              <Image
                // src={
                //   employeeData?.pictureUrl
                //     ? employeeData?.pictureUrl
                //     : '/img/image-placeholder.svg'
                // }
                src={'/img/image-placeholder.svg'}
                alt="Employee Avatar"
                width={140}
                height={140}
                className="flex rounded-full h-[140px]"
              />
              <div className="flex flex-col gap-4 w-full px-6">
                <div className="flex flex-col gap-4 w-full">
                  <div className="flex">
                    <div className="text-14 text-inactive min-w-[120px] mr-[24px]">
                      รหัสพนักงาน
                    </div>
                    <div className="text-14">
                      {employeeData?.shownEmployeeId || 'N/A'}
                    </div>

                    <div className="text-14 text-inactive min-w-[120px] ml-[240px] mr-[24px]">
                      ชื่อ - นามสกุล
                    </div>
                    <div className="text-14">
                      {employeeData?.name} {employeeData?.surname} (
                      {employeeData?.nickname})
                    </div>
                  </div>
                  <div className="flex">
                    <div className="text-14 text-inactive min-w-[120px] mr-[24px]">
                      เบอร์โทรศัพท์
                    </div>
                    <div className="text-14">
                      {formatPhoneNumber(employeeData?.phone) || 'N/A'}
                    </div>
                  </div>
                  <div className="flex">
                    <div className="text-14 text-inactive min-w-[120px] mr-[24px]">
                      สัญชาติ
                    </div>
                    <Radio.Group
                      defaultValue={employeeData?.isThai ? 'thai' : 'foreigner'}
                      className="flex gap-4"
                    >
                      <Radio
                        value={'thai'}
                        disabled={!employeeData?.isThai}
                        className="text-14"
                      >
                        คนไทย
                      </Radio>
                      <Radio
                        value={'foreigner'}
                        disabled={employeeData?.isThai}
                        className="text-14"
                      >
                        คนต่างชาติ
                      </Radio>
                    </Radio.Group>

                    <div className="text-14 text-inactive min-w-[120px] ml-[100px] mr-[24px]">
                      รหัสประจำตัวประชาชน
                    </div>
                    <div className="text-14">
                      {employeeData?.additionalInfo.citizenId || 'N/A'}
                    </div>
                  </div>
                  <div className="flex gap-[24px]">
                    <div className="text-14 text-inactive min-w-[120px]">
                      วันเกิด
                    </div>
                    <div className="text-14">
                      {employeeData?.birthDate
                        ? formatThaiDate(employeeData.birthDate, true)
                        : 'N/A'}
                    </div>
                  </div>

                  {/* Address on ID */}
                  <div className="flex gap-[24px]">
                    <div className="text-14 text-inactive min-w-[120px]">
                      ที่อยู่ตามบัตร
                    </div>
                    <div className="text-14">
                      {employeeFullPermanentAddress()}
                    </div>
                  </div>
                  {/* Current Address */}
                  <div className="flex gap-[24px]">
                    <div className="text-14 text-inactive min-w-[120px]">
                      ที่อยู่ปัจจุบัน
                    </div>
                    <div
                      className="text-[#6B6B6B] text-14"
                      onMouseEnter={() => setAddressHover(true)}
                      onMouseLeave={() => setAddressHover(false)}
                    >
                      {employeeData?.isSameAddress ? (
                        <span>
                          {addressHover
                            ? employeeFullPermanentAddress()
                            : 'ตามบัตรประชาชน'}
                        </span>
                      ) : (
                        <span>{employeeFullCurrentAddress()}</span>
                      )}
                    </div>
                    {/* <div>{employeeFullAddress()}</div> */}
                  </div>
                </div>
              </div>
            </section>

            <Divider />

            <section className="flex gap-2 pb-6">
              <header className="text-16 font-semibold">สถานภาพ</header>
            </section>
            <section>
              <div className="flex flex-col ml-8 gap-4">
                <div className="flex text-14 gap-[40px]">
                  <div className="text-14 text-inactive min-w-[120px]">
                    สถานภาพ
                  </div>
                  <Radio.Group
                    buttonStyle="outline"
                    defaultValue={employeeData?.additionalInfo.maritalStatus}
                    onChange={e => setMaritalStatus(e.target.value)}
                  >
                    {/* wait for real info for disable */}
                    <Radio
                      value="single"
                      disabled={
                        employeeData?.additionalInfo.maritalStatus !== 'single'
                      }
                      className="text-14 pr-4"
                    >
                      โสด
                    </Radio>
                    <Radio
                      value="married"
                      disabled={
                        employeeData?.additionalInfo.maritalStatus !== 'married'
                      }
                      className="text-14 pr-4"
                    >
                      สมรสแล้ว
                    </Radio>
                    <Radio
                      value="divorced"
                      disabled={
                        employeeData?.additionalInfo.maritalStatus !==
                        'divorced'
                      }
                      className="text-14"
                    >
                      หย่าร้าง
                    </Radio>
                  </Radio.Group>
                </div>

                {maritalStatus === 'married' && (
                  <div className="flex flex-col gap-4">
                    <div className="flex gap-[40px]">
                      <div className="text-14 text-inactive min-w-[120px]">
                        ข้อมูลคู่สมรส
                      </div>
                      <div className="text-14 min-w-[200px]">
                        {employeeData?.additionalInfo.spouseTitle ||
                        employeeData?.additionalInfo.spouseName ||
                        employeeData?.additionalInfo.spouseSurname
                          ? `${employeeData?.additionalInfo.spouseTitle} ${employeeData?.additionalInfo.spouseName} ${employeeData?.additionalInfo.spouseSurname}`
                          : '-'}
                      </div>

                      <div className="text-14 text-inactive min-w-[80px] ml-[72px] mr-[40px]">
                        อาชีพคู่สมรส
                      </div>
                      <div className="text-14">
                        {employeeData?.additionalInfo.spouseOccupation || '-'}
                      </div>
                    </div>
                    <div className="flex gap-[40px]">
                      <div className="text-14 text-inactive min-w-[120px]">
                        เบอร์โทรศัพท์คู่สมรส
                      </div>
                      <div className="text-14 min-w-[200px]">
                        {employeeData?.additionalInfo.spousePhone || '-'}
                      </div>

                      <div className="text-14 text-inactive min-w-[80px] ml-[72px] mr-[40px]">
                        จำนวนบุตร
                      </div>
                      <div className="text-14">
                        {employeeData?.additionalInfo.childrenCount
                          ? `${employeeData.additionalInfo.childrenCount} คน`
                          : '-'}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>

            <Divider />

            <section className="flex gap-2 pb-6">
              <header className="text-16 font-semibold">
                ข้อมูลด้านสุขภาพ
              </header>
            </section>
            <section>
              <div className="flex ml-8">
                <div className="text-14 text-inactive min-w-[120px] mr-[40px]">
                  โรคประจำตัว
                </div>
                <div className="text-14">
                  {employeeData?.additionalInfo.medicalConditions || 'ไม่มี'}
                </div>
              </div>
            </section>

            <Divider />

            <section className="flex gap-2 pb-6">
              <header className="text-16 font-semibold">การศึกษา</header>
            </section>
            <section>
              <div className="flex flex-col gap-4 ml-8">
                <div className="flex gap-[40px]">
                  <div className="text-14 text-inactive min-w-[120px]">
                    ระดับการศึกษาสูงสุด
                  </div>
                  <div className="text-14 min-w-[200px]">
                    {employeeData?.additionalInfo.educationHighest || '-'}
                  </div>

                  <div className="text-14 text-inactive min-w-[80px] ml-[72px] mr-[40px]">
                    สาขา
                  </div>
                  <div className="text-14">
                    {employeeData?.additionalInfo.educationMajor || '-'}
                  </div>
                </div>
                <div className="flex gap-[40px]">
                  <div className="text-14 text-inactive min-w-[120px]">
                    ชื่อสถานศึกษา
                  </div>
                  <div className="text-14 min-w-[200px]">
                    {employeeData?.additionalInfo.educationName || '-'}
                  </div>

                  <div className="text-14 text-inactive min-w-[80px] ml-[72px] mr-[40px]">
                    คะแนน
                  </div>
                  <div className="text-14">
                    {employeeData?.additionalInfo.educationGpax || '-'}
                  </div>
                </div>
              </div>
            </section>

            <Divider />

            <section className="flex gap-2 pb-6">
              <header className="text-16 font-semibold">
                ข้อมูลประกันสังคม
              </header>
            </section>
            <section>
              <div className="flex flex-col gap-4 ml-8">
                <div className="flex gap-[40px]">
                  <div className="text-14 text-inactive min-w-[120px]">
                    รับสิทธิ์ประกันสังคม
                  </div>
                  <div className="text-14 min-w-[200px]">
                    <Switch
                      // checked={employeeData?.isSocialSecurityEnabled}
                      disabled
                    />
                  </div>
                </div>
                <div className="flex gap-[40px]">
                  <div className="text-14 text-inactive min-w-[120px]">
                    โรงพยาบาล
                  </div>
                  <div className="text-14 min-w-[200px]">
                    {employeeData?.additionalInfo.socialSecurityHospitalName ||
                      'ไม่มี'}
                  </div>

                  <div className="text-14 text-inactive min-w-[100px] ml-[72px] mr-[20px]">
                    เลขประกันสังคม
                  </div>
                  <div className="text-14">
                    {employeeData?.additionalInfo.socialSecurityId || '-'}
                  </div>
                </div>
              </div>
            </section>

            <Divider />

            <section className="flex gap-2 pb-6">
              <header className="text-16 font-semibold">
                บุคคลที่ติดต่อกรณีฉุกเฉิน
              </header>
            </section>
            <section>
              <div className="flex flex-col gap-4 ml-8">
                <div className="flex gap-[40px]">
                  <div className="text-14 text-inactive min-w-[120px]">
                    ชื่อ - นามสกุล
                  </div>
                  <div className="text-14 min-w-[200px]">
                    {employeeData?.additionalInfo.emergencyName || '-'}
                  </div>

                  <div className="text-14 text-inactive min-w-[80px] ml-[72px] mr-[40px]">
                    เกี่ยวข้องเป็น
                  </div>
                  <div className="text-14">
                    {employeeData?.additionalInfo.emergencyRelation || '-'}
                  </div>
                </div>
                <div className="flex gap-[40px]">
                  <div className="text-14 text-inactive min-w-[120px]">
                    เบอร์โทรศัพท์
                  </div>
                  <div className="text-14 min-w-[200px]">
                    {formatPhoneNumber(
                      employeeData?.additionalInfo.emergencyPhone
                    ) || '-'}
                  </div>
                </div>
              </div>
            </section>

            <Divider />

            {/* Work History - wait for real data */}
            <section className="flex gap-2 pb-6">
              <header className="text-16 font-semibold">ประวัติการทำงาน</header>
            </section>
            <section>
              <Table
                dataSource={employeeData?.additionalInfo.workHistory}
                columns={workHistoryColumns}
                pagination={false}
                rowKey="workPlace"
              />
            </section>

            <Divider />

            {/* Emergency Contact */}
            <section className="flex gap-2 pb-6">
              <header className="text-16 font-semibold">
                บุคคลที่ติดต่อกรณีฉุกเฉิน
              </header>
            </section>
            <section>
              <div className="flex flex-col gap-4 ml-8">
                <div className="flex gap-[40px]">
                  <div className="text-14 text-inactive min-w-[120px]">
                    ตำแหน่งงาน
                  </div>
                  <div className="text-14 min-w-[200px]">
                    {mapPosition(employeeData?.position ?? '') || '-'}
                  </div>
                </div>
                <div className="flex gap-[40px]">
                  <div className="text-14 text-inactive min-w-[120px]">
                    วันที่เริ่มงาน
                  </div>
                  <div className="text-14 min-w-[200px]">
                    {formatThaiDate(employeeData?.startDate) || '-'}
                  </div>
                </div>
              </div>
            </section>
          </div>

          <Modal
            title={
              <div
                style={{
                  textAlign: 'center',
                  fontSize: '20px',
                  fontWeight: 'semibold',
                  paddingBottom: '16px',
                }}
              >
                คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลพนักงาน
              </div>
            }
            open={isModalVisible}
            onCancel={handleCancelDelete}
            closeIcon={false}
            footer={[
              <div className="flex justify-center gap-10" key="footer">
                <CustomButton
                  key="stay"
                  theme="flat"
                  onClick={handleCancelDelete}
                  className="h-[46px] w-[111px]"
                >
                  ยกเลิก
                </CustomButton>
                <CustomButton
                  key="leave"
                  theme="primary"
                  onClick={handleConfirmDelete}
                  className="h-[46px] w-[111px]"
                >
                  ยืนยัน
                </CustomButton>
              </div>,
            ]}
          />
        </div>
      )}
    </div>
  );
};

export default EmployeeOverview;
