'use client';

import { CustomButton } from '@/components/Buttons';
import { TimeRangePicker } from '@/components/TimeRangePicker';
import { getClientById } from '@/services/Client';
import {
  ArrowLeftOutlined,
  InboxOutlined,
  PlusOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import {
  Alert,
  Breadcrumb,
  Collapse,
  DatePicker,
  Divider,
  Form,
  Image,
  Input,
  Radio,
  Select,
  Spin,
  Switch,
  Typography,
  Upload,
  message,
} from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import buddhistEra from 'dayjs/plugin/buddhistEra';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import './style.css';

dayjs.extend(buddhistEra);
dayjs.locale('th');

interface ClientData {
  id: string;
  name: string;
  industry?: string;
  contactPerson: string;
  phone: string;
  salespersonId?: string; // Optional
  addressId: number;
  address: Address;
}

interface Address {
  houseNumber: string;
  village?: string;
  building?: string;
  floor?: string;
  alley?: string;
  street: string;
  subDistrict: string;
  district: string;
  province: string;
  postalCode: string;
  latitude?: number;
  longitude?: number;
}

interface WorkSchedule {
  id: string;
  selectedDays: string[];
  startTime: string | null;
  endTime: string | null;
  isOverlapping?: boolean;
}

const workDaysOptions: { label: string; value: string }[] = [
  { label: 'จันทร์', value: 'mon' },
  { label: 'อังคาร', value: 'tue' },
  { label: 'พุธ', value: 'wed' },
  { label: 'พฤหัส', value: 'thu' },
  { label: 'ศุกร์', value: 'fri' },
  { label: 'เสาร์', value: 'sat' },
  { label: 'อาทิตย์', value: 'sun' },
];

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });

const CreateContract = ({ params }: { params: { id: number } }) => {
  const id = params.id;
  const router = useRouter();
  const [form] = Form.useForm();
  const [isAutoFill, setIsAutoFill] = useState(false);
  const [loading, setLoading] = useState(false);
  const [clientData, setClientData] = useState<ClientData>();
  const [, setStartDate] = useState<dayjs.Dayjs | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [transportation, setTransportation] = useState<string>();
  const [paymentType, setPaymentType] = useState<string>();
  const [OTPaymentType, setOTPaymentType] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [mainShift, setMainShift] = useState<WorkSchedule>({
    id: 'main-schedule',
    selectedDays: [],
    startTime: null,
    endTime: null,
  });
  const [extraShifts, setExtraShifts] = useState<WorkSchedule[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const { Dragger } = Upload;

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleUploadChange: UploadProps['onChange'] = ({
    fileList: newFileList,
  }) => setFileList(newFileList);

  const handleRemove = (file: UploadFile) => {
    setFileList(fileList.filter(item => item.uid !== file.uid));
    message.success('ไฟล์ถูกลบเรียบร้อยแล้ว');
  };

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  const handleSwitchChange = (checked: boolean) => {
    setIsAutoFill(checked);
    if (checked) {
      form.setFieldsValue({
        houseNumber: clientData?.address.houseNumber,
        building: clientData?.address.building,
        floor: clientData?.address.floor,
        village: clientData?.address.village,
        alley: clientData?.address.alley,
        road: clientData?.address.street,
        subDistrict: clientData?.address.subDistrict,
        district: clientData?.address.district,
        province: clientData?.address.province,
        postalCode: clientData?.address.postalCode,
      });
    } else {
      form.resetFields([
        'houseNumber',
        'building',
        'floor',
        'village',
        'alley',
        'road',
        'subDistrict',
        'district',
        'province',
        'postalCode',
      ]);
    }
  };

  const handleStartDateChange = (date: dayjs.Dayjs | null) => {
    setStartDate(date);
    if (date) {
      // Set the end date to +1 year from the start date
      const newEndDate = date.add(1, 'year');
      form.setFieldsValue({ endDate: newEndDate });
    } else {
      form.setFieldsValue({ endDate: null });
    }
  };

  const handlePaymentTypeChange = (e: any) => {
    setPaymentType(e.target.value);
  };

  const handleOTTypeChange = (e: any) => {
    const value = e.target.value;
    setOTPaymentType(value);

    if (value === 'ตามMB') {
      form.setFieldsValue({
        rate1_5x: null,
        rate2x: null,
        rate3x: null,
      });
    }
  };

  // const toggleSelection = (value: string) => {
  //   if (value === 'all') {
  //     setSelectedDays(workDaysOptions.map(option => option.value));
  //   }
  //   setSelectedDays(prev =>
  //     prev.includes(value)
  //       ? prev.filter(day => day !== value)
  //       : [...prev, value]
  //   );
  // };

  const handleDayToggle = (
    scheduleId: string,
    value: string,
    isMainShift: boolean
  ) => {
    if (isMainShift) {
      // Main shift logic
      const updatedDays = mainShift.selectedDays.includes(value)
        ? mainShift.selectedDays.filter(day => day !== value)
        : [...mainShift.selectedDays, value];
      setMainShift({ ...mainShift, selectedDays: updatedDays });
    } else {
      // Extra shift logic
      setExtraShifts(prev =>
        prev.map(shift =>
          shift.id === scheduleId
            ? {
                ...shift,
                selectedDays: shift.selectedDays.includes(value)
                  ? shift.selectedDays.filter(day => day !== value)
                  : [...shift.selectedDays, value],
              }
            : shift
        )
      );
    }
  };

  const handleTimeRangeChange = (
    scheduleId: string,
    value: [dayjs.Dayjs | null, dayjs.Dayjs | null],
    isMainShift: boolean
  ) => {
    if (isMainShift) {
      setMainShift({
        ...mainShift,
        startTime: value?.[0]?.format('HH:mm') || null,
        endTime: value?.[1]?.format('HH:mm') || null,
      });
    } else {
      setExtraShifts(prev =>
        prev.map(shift =>
          shift.id === scheduleId
            ? {
                ...shift,
                startTime: value?.[0]?.format('HH:mm') || null,
                endTime: value?.[1]?.format('HH:mm') || null,
              }
            : shift
        )
      );
    }
  };

  const handleAddExtraShift = () => {
    const newShift: WorkSchedule = {
      id: `extra-schedule-${Date.now()}`,
      selectedDays: [],
      startTime: null,
      endTime: null,
    };
    setExtraShifts([...extraShifts, newShift]);
  };

  const handleRemoveExtraShift = (shiftId: string) => {
    setExtraShifts(extraShifts.filter(shift => shift.id !== shiftId));
  };

  const hasOverlap = (
    start1: string | null,
    end1: string | null,
    start2: string | null,
    end2: string | null
  ): boolean => {
    const [start1Time, end1Time, start2Time, end2Time] = [
      dayjs(start1, 'HH:mm'),
      dayjs(end1, 'HH:mm'),
      dayjs(start2, 'HH:mm'),
      dayjs(end2, 'HH:mm'),
    ];

    return (
      (start1Time.isBefore(end2Time) && start1Time.isAfter(start2Time)) ||
      (end1Time.isBefore(end2Time) && end1Time.isAfter(start2Time)) ||
      start1Time.isSame(start2Time) ||
      end1Time.isSame(end2Time)
    );
  };

  const validateShifts = () => {
    const allShifts = [mainShift, ...extraShifts];
    let hasValidationError = false;

    const updatedShifts = allShifts.map(shift => ({
      ...shift,
      isOverlapping: false,
    }));

    for (let i = 0; i < allShifts.length; i++) {
      for (let j = i + 1; j < allShifts.length; j++) {
        const shift1 = allShifts[i];
        const shift2 = allShifts[j];

        const hasDayOverlap = shift1.selectedDays.some(day =>
          shift2.selectedDays.includes(day)
        );

        const hasTimeOverlap =
          shift1.startTime &&
          shift1.endTime &&
          shift2.startTime &&
          shift2.endTime &&
          hasOverlap(
            shift1.startTime,
            shift1.endTime,
            shift2.startTime,
            shift2.endTime
          );

        if (hasDayOverlap && hasTimeOverlap) {
          updatedShifts[i].isOverlapping = true;
          updatedShifts[j].isOverlapping = true;
          hasValidationError = true;
        }
      }
    }

    setMainShift(updatedShifts[0]);
    setExtraShifts(updatedShifts.slice(1));

    return hasValidationError
      ? 'เวลาทำงานซ้อนกัน โปรดตรวจสอบใหม่อีกครั้ง'
      : null;
  };

  const isCompletelyEmpty = (shift: WorkSchedule) => {
    return (
      shift.selectedDays.length === 0 && !shift.startTime && !shift.endTime
    );
  };

  const handleSubmit = (values: any) => {
    setIsFormSubmitted(true);
    const validationError = validateShifts();
    if (validationError) {
      setShowAlert(true);
      setErrorMessage(validationError);
      setTimeout(() => {
        setErrorMessage('');
        setShowAlert(false);
      }, 3000);
      return;
    }

    const formatShifts = (shifts: WorkSchedule[]) => {
      return shifts.map(shift => ({
        workDay: shift.selectedDays.map(day => day.toUpperCase()),
        startTime: shift.startTime ? shift.startTime.replace(':', '.') : null,
        endTime: shift.endTime ? shift.endTime.replace(':', '.') : null,
      }));
    };

    const shiftPattern = [
      ...formatShifts([mainShift]),
      ...formatShifts(extraShifts.filter(shift => !isCompletelyEmpty(shift))),
    ];

    const formattedValues = {
      ...values,
      shiftPattern,
    };

    console.log('Formatted Form Values:', formattedValues);
  };

  // const onFinishFailed = ({ errorFields }: any) => {
  //   if (errorFields.length > 0) {
  //     form.scrollToField(errorFields[0].name, {
  //       behavior: 'smooth',
  //       block: 'center',
  //     });
  //   }
  // };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getClientById(id!); //never be null anyway
        console.log(response);
        console.log(response.data);
        setClientData(response.data);
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
        <div className="flex flex-col h-screen gap-6">
          <Breadcrumb
            items={[
              { title: 'หน้าหลัก', href: '/dashboard' },
              { title: 'จัดการหน่วยงาน', href: '/dashboard/client-management' },
              {
                title: `${clientData?.name}`,
                href: `/dashboard/client-management/${id}`,
              },
              { title: 'สร้างสัญญางานจ้างใหม่' },
            ]}
          />
          <div className="flex gap-2 items-center">
            <ArrowLeftOutlined
              onClick={() => {
                if (window.history.length > 1) {
                  router.back();
                } else {
                  router.push(`/dashboard/client-management/${id}`);
                }
              }}
            />
            <span className="font-semibold text-20">สร้างสัญญางานจ้างใหม่</span>
          </div>

          <div
            className="w-full overflow-y-auto max-w-[780px] mt-4"
            style={{
              maxHeight: 'calc(100vh - 140px)',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            <div className="flex-1 px-10 pb-10 max-w-[1080px]">
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                onFinishFailed={() => {
                  setIsFormSubmitted(true);
                  // onFinishFailed;
                }}
                initialValues={{
                  switch: false,
                }}
              >
                <h3 className="text-16 font-semibold mb-4">ข้อมูลสัญญา</h3>
                <div className="flex flex-col">
                  <div className="flex gap-6">
                    <Form.Item
                      label="ชื่อสัญญางานจ้าง"
                      name="contractName"
                      className="w-[400px]"
                    >
                      <Input
                        placeholder="ระบุชื่อชื่อสัญญางานจ้าง"
                        defaultValue={clientData?.name}
                      />
                    </Form.Item>
                    <Form.Item
                      label="พนักงานฝ่ายการตลาด"
                      name="assignedEmployee"
                      rules={[{ required: true, message: '' }]}
                      className="w-[176px]"
                    >
                      <Input
                        placeholder="เพิ่มพนักงานที่นี่"
                        prefix={<UserAddOutlined className="text-[#BFBFBF]" />}
                      />
                    </Form.Item>
                  </div>

                  <div className="flex gap-6">
                    <Form.Item
                      label="พนักงานแม่บ้าน"
                      name="assignedMaid"
                      className="w-[188px]"
                    >
                      <Input
                        placeholder="เพิ่มพนักงานที่นี่"
                        prefix={<UserAddOutlined className="text-[#BFBFBF]" />}
                      />
                    </Form.Item>
                    <Form.Item
                      label="หัวหน้าผู้ดูแล"
                      name="assignedSupervisor"
                      className="w-[188px]"
                    >
                      <Input
                        placeholder="เพิ่มพนักงานที่นี่"
                        prefix={<UserAddOutlined className="text-[#BFBFBF]" />}
                      />
                    </Form.Item>
                  </div>

                  <div className="flex gap-6">
                    <Form.Item
                      label="วันเริ่มต้นสัญญา"
                      name="startDate"
                      className="w-[188px]"
                    >
                      <DatePicker
                        format="DD-MM-BBBB"
                        placeholder="เพิ่มพนักงานที่นี่"
                        className="w-full"
                        onChange={handleStartDateChange}
                      />
                    </Form.Item>
                    <Form.Item
                      label="วันสิ้นสุดสัญญา"
                      name="endDate"
                      className="w-[188px]"
                    >
                      <DatePicker
                        format="DD-MM-BBBB"
                        placeholder="เลือกวันที่"
                        className="w-full"
                      />
                    </Form.Item>
                  </div>
                </div>
                <Divider />
                <h3 className="text-16 font-semibold mb-4">
                  สถานที่ปฏิบัติงาน
                </h3>
                <Form.Item
                  label="ตามที่อยู่หน่วยงาน"
                  name="isSameAddress"
                  valuePropName="checked"
                  layout="horizontal"
                  colon={false}
                >
                  <Switch
                    onChange={handleSwitchChange}
                    className="ml-[112px]"
                  />
                </Form.Item>
                <div className="flex flex-col">
                  <div className="flex gap-3">
                    <Form.Item
                      label="บ้านเลขที่"
                      name="houseNumber"
                      rules={[{ required: true, message: '' }]}
                      className="w-[80px]"
                    >
                      <Input disabled={isAutoFill} placeholder="บ้านเลขที่" />
                    </Form.Item>
                    <Form.Item
                      label="อาคาร /ตึก"
                      name="building"
                      className="w-[308px]"
                    >
                      <Input
                        disabled={isAutoFill}
                        placeholder="บ้านอาคาร / ตึก"
                      />
                    </Form.Item>
                    <Form.Item label="ชั้น" name="floor" className="w-[52px]">
                      <Input disabled={isAutoFill} placeholder="ชั้น" />
                    </Form.Item>
                    <Form.Item label="หมู่" name="village" className="w-[52px]">
                      <Input disabled={isAutoFill} placeholder="หมู่" />
                    </Form.Item>
                    <Form.Item label="ซอย" name="alley" className="w-[160px]">
                      <Input disabled={isAutoFill} placeholder="ซอย" />
                    </Form.Item>
                  </div>

                  <div className="flex gap-3">
                    <Form.Item label="ถนน" name="road" className="w-[156px]">
                      <Input disabled={isAutoFill} placeholder="ถนน" />
                    </Form.Item>
                    <Form.Item
                      label="ตำบล / แขวง"
                      name="subDistrict"
                      rules={[{ required: true, message: '' }]}
                      className="w-[140px]"
                    >
                      <Input disabled={isAutoFill} placeholder="ตำบล / แขวง" />
                    </Form.Item>
                    <Form.Item
                      label="อำเภอ / เขต"
                      name="district"
                      className="w-[140px]"
                    >
                      <Input disabled={isAutoFill} placeholder="อำเภอ / เขต" />
                    </Form.Item>
                    <Form.Item
                      label="จังหวัด"
                      name="province"
                      rules={[{ required: true, message: '' }]}
                      className="w-[120px]"
                    >
                      <Input disabled={isAutoFill} placeholder="จังหวัด" />
                    </Form.Item>
                    <Form.Item
                      label="รหัสไปรษณีย์"
                      name="postalCode"
                      rules={[{ required: true, message: '' }]}
                      className="w-[96px]"
                    >
                      <Input disabled={isAutoFill} placeholder="รหัสไปรษณีย์" />
                    </Form.Item>
                  </div>
                </div>
                <Divider />
                <h3 className="text-16 font-semibold mb-4">ข้อมูลการเดินทาง</h3>
                <Form.Item
                  label="วิธีการเดินทาง"
                  name="transportation"
                  layout="horizontal"
                  colon={false}
                  rules={[{ required: true, message: '' }]}
                >
                  <Radio.Group
                    className="flex items-center gap-4 ml-10"
                    onChange={e => setTransportation(e.target.value)}
                  >
                    <div className="flex items-center">
                      <Radio value="bus">รถเมล์:</Radio>
                      <Input
                        placeholder="ระบุสายรถ"
                        className="w-[88px]"
                        disabled={transportation !== 'bus'}
                      />
                    </div>
                    <div className="custom-radio-padding">
                      <Radio
                        value="minibus"
                        style={{ marginRight: 0, paddingRight: 0 }}
                      >
                        รถสองแถว
                      </Radio>
                    </div>
                    <div className="flex items-center">
                      <Radio value="other">อื่นๆ</Radio>
                      <Input
                        placeholder="เช่น BTS"
                        className="w-[105px]"
                        disabled={transportation !== 'other'}
                      />
                    </div>
                  </Radio.Group>
                </Form.Item>
                <div className="flex gap-3">
                  <Form.Item
                    label="ระยะทางจากปากซอยหรือจุดขนส่ง"
                    name="distance"
                    className="w-[294px]"
                  >
                    <Input placeholder="เช่น 200 เมตรจากป้ายรถเมล์" />
                  </Form.Item>
                  <Form.Item
                    label="ลิงก์ Google Maps"
                    name="googleMapLink"
                    className="w-[294px]"
                  >
                    <Input placeholder="https://www.google.co.th/maps/xxxxx" />
                  </Form.Item>
                </div>
                <div className="my-4">รูปภาพตึกอาคารเพิ่มเติม</div>
                <div className="upload-container w-[600px] h-[124px]">
                  {fileList.length === 0 ? (
                    <Dragger
                      name="file"
                      multiple
                      fileList={fileList}
                      beforeUpload={() => false} // Prevent automatic upload
                      progress={{
                        strokeColor: '#F9991E',
                        strokeWidth: 2,
                        showInfo: false,
                      }}
                      locale={{
                        uploading: 'กำลังอัปโหลด...',
                      }}
                      onChange={({ file, fileList: newFileList }) => {
                        // Check if new and append to the `fileList` state
                        const isAlreadyUploaded = fileList.some(
                          existingFile => existingFile.uid === file.uid
                        );

                        if (!isAlreadyUploaded) {
                          setFileList([...newFileList]);
                        }
                      }}
                      onDrop={e => {
                        console.log('Dropped files', e.dataTransfer.files);
                      }}
                      accept="image/*"
                    >
                      <p className="ant-upload-drag-icon">
                        <InboxOutlined className="text-[#F9991E]" />
                      </p>
                      <p className="ant-upload-text text-[#A3A3A3]">
                        คลิกหรือลากไฟล์มาที่นี่เพื่ออัปโหลดรูป
                      </p>
                    </Dragger>
                  ) : (
                    <>
                      <Upload
                        // action='wait for api ja'
                        listType="picture-card"
                        fileList={fileList}
                        onPreview={handlePreview}
                        onChange={handleUploadChange}
                        onRemove={handleRemove}
                        maxCount={4}
                        accept="image/*"
                        progress={{
                          strokeColor: '#F9991E',
                          strokeWidth: 2,
                          showInfo: false,
                        }}
                        locale={{
                          uploading: 'กำลังอัปโหลด...',
                        }}
                      >
                        {fileList.length >= 4 ? null : uploadButton}
                      </Upload>
                      {previewImage && (
                        <Image
                          alt="contract-preview"
                          wrapperStyle={{ display: 'none' }}
                          preview={{
                            visible: previewOpen,
                            onVisibleChange: visible => setPreviewOpen(visible),
                            afterOpenChange: visible =>
                              !visible && setPreviewImage(''),
                          }}
                          src={previewImage}
                        />
                      )}
                    </>
                  )}
                </div>
                <Divider />
                <div>
                  <h3 className="text-16 font-semibold mb-4 flex items-center">
                    <Typography.Text type="danger" className="mr-1">
                      *
                    </Typography.Text>
                    รายละเอียดการจ้างงาน
                  </h3>
                  <div className="flex flex-col">
                    <Form.Item
                      label={
                        <span className="w-[120px] mr-[40px]">
                          รูปแบบการจ่ายค่าแรง
                        </span>
                      }
                      name="paymentType"
                      rules={[{ required: true, message: '' }]}
                      className="hide-asterisk"
                      layout="horizontal"
                      labelAlign="left"
                      colon={false}
                      style={{ marginBottom: 16 }}
                    >
                      <Radio.Group onChange={handlePaymentTypeChange}>
                        <Radio value="รายวัน">รายวัน</Radio>
                        <Radio value="รายเดือน">รายเดือน</Radio>
                      </Radio.Group>
                    </Form.Item>

                    <Form.Item
                      label={
                        paymentType === undefined ? (
                          <span>ค่าจ้างแม่บ้าน</span>
                        ) : paymentType === 'รายวัน' ? (
                          <span>
                            ค่าจ้างแม่บ้าน{' '}
                            <span className="text-[#6B6B6B]">(บาท / วัน)</span>
                          </span>
                        ) : (
                          <span>
                            ค่าจ้างแม่บ้าน{' '}
                            <span className="text-[#6B6B6B]">
                              (บาท / เดือน)
                            </span>
                          </span>
                        )
                      }
                      name="salary"
                      rules={[{ required: true, message: '' }]}
                      className="hide-asterisk w-[400px]"
                    >
                      <Input
                        placeholder="ระบุจำนวนเงิน"
                        disabled={paymentType === undefined}
                        suffix={
                          <span
                            style={{
                              color: 'black',
                              opacity: 0.25,
                            }}
                          >
                            ฿
                          </span>
                        }
                      />
                    </Form.Item>
                  </div>

                  <div className="flex flex-col">
                    <Form.Item
                      label={
                        <span className="w-[120px] mr-[40px]">
                          รูปแบบการจ่าย OT
                        </span>
                      }
                      name="OTPaymentType"
                      rules={[{ required: true, message: '' }]}
                      className="hide-asterisk"
                      layout="horizontal"
                      labelAlign="left"
                      colon={false}
                      style={{ marginBottom: 16 }}
                    >
                      <Radio.Group onChange={handleOTTypeChange}>
                        <Radio value="ตามMB">ตามMB</Radio>
                        <Radio value="ตามลูกค้า">ตามลูกค้า</Radio>
                      </Radio.Group>
                    </Form.Item>

                    <div className="flex gap-6">
                      <Form.Item
                        label={
                          <span>
                            1.5x{' '}
                            <span className="text-[#6B6B6B]">
                              (บาท/ชั่วโมง)
                            </span>
                          </span>
                        }
                        name="rate1_5x"
                        rules={[{ required: true, message: '' }]}
                        className="w-[118px] hide-asterisk"
                      >
                        <Input
                          placeholder={OTPaymentType === 'ตามMB' ? '-' : 'ระบุ'}
                          disabled={
                            OTPaymentType === 'ตามMB' ||
                            OTPaymentType === undefined
                          }
                          suffix={
                            <span
                              style={{
                                color: 'black',
                                opacity: 0.25,
                              }}
                            >
                              ฿
                            </span>
                          }
                        />
                      </Form.Item>
                      <Form.Item
                        label={
                          <span>
                            2x{' '}
                            <span className="text-[#6B6B6B]">
                              (บาท/ชั่วโมง)
                            </span>
                          </span>
                        }
                        name="rate2x"
                        rules={[{ required: true, message: '' }]}
                        className="w-[118px] hide-asterisk"
                      >
                        <Input
                          placeholder={OTPaymentType === 'ตามMB' ? '-' : 'ระบุ'}
                          disabled={
                            OTPaymentType === 'ตามMB' ||
                            OTPaymentType === undefined
                          }
                          suffix={
                            <span
                              style={{
                                color: 'black',
                                opacity: 0.25,
                              }}
                            >
                              ฿
                            </span>
                          }
                        />
                      </Form.Item>
                      <Form.Item
                        label={
                          <span>
                            3x{' '}
                            <span className="text-[#6B6B6B]">
                              (บาท/ชั่วโมง)
                            </span>
                          </span>
                        }
                        name="rate3x"
                        rules={[{ required: true, message: '' }]}
                        className="w-[118px] hide-asterisk"
                      >
                        <Input
                          placeholder={OTPaymentType === 'ตามMB' ? '-' : 'ระบุ'}
                          disabled={
                            OTPaymentType === 'ตามMB' ||
                            OTPaymentType === undefined
                          }
                          suffix={
                            <span
                              style={{
                                color: 'black',
                                opacity: 0.25,
                              }}
                            >
                              ฿
                            </span>
                          }
                        />
                      </Form.Item>
                    </div>
                  </div>
                </div>
                <Divider />
                <h3 className="text-16 font-semibold mb-4 flex items-center">
                  <Typography.Text type="danger" className="mr-1">
                    *
                  </Typography.Text>
                  กะการทำงาน
                </h3>
                <Form.Item
                  label="เลือกเซตวันหยุดนักขัตฤกษ์"
                  name="holidaySet"
                  rules={[{ required: true, message: '' }]}
                  className="hide-asterisk w-[400px]"
                >
                  {/* wait for when finishing holiday sets */}
                  <Select placeholder="เซตวันหยุดที่ 1 (14 วัน)">
                    <Select.Option value="set1">
                      เซตวันหยุดที่ 1 (14 วัน)
                    </Select.Option>
                    <Select.Option value="set2">
                      เซตวันหยุดที่ 2 (12 วัน)
                    </Select.Option>
                  </Select>
                </Form.Item>
                <section>
                  <Form.Item
                    name="mainShifValidation"
                    rules={[
                      {
                        validator: async () => {
                          const isMainShiftValid =
                            mainShift.selectedDays.length > 0 &&
                            mainShift.startTime &&
                            mainShift.endTime;

                          const isExtraShiftValid = extraShifts.every(shift => {
                            const isCompletelyEmpty =
                              shift.selectedDays.length === 0 &&
                              !shift.startTime &&
                              !shift.endTime;

                            if (isCompletelyEmpty) return true; // Allow completely empty extra shifts
                            return (
                              shift.selectedDays.length > 0 &&
                              shift.startTime &&
                              shift.endTime
                            );
                          });

                          if (!isMainShiftValid || !isExtraShiftValid) {
                            throw new Error('');
                          }
                        },
                      },
                    ]}
                  >
                    <Collapse
                      activeKey="1"
                      size="small"
                      className={`collapse-item ${
                        isFormSubmitted &&
                        (mainShift.selectedDays.length === 0 ||
                          !mainShift.startTime ||
                          !mainShift.endTime)
                          ? 'error-border'
                          : ''
                      } ${mainShift.isOverlapping ? 'error-border' : ''}`}
                      items={[
                        {
                          key: '1',
                          label: 'กะการทำงานหลัก',
                          children: (
                            <div className="flex gap-6">
                              <div className="mb-6">
                                <div className="flex text-sm font-regular justify-between w-[430px] mb-[10px]">
                                  <span>วันที่ทำงาน</span>
                                  <span
                                    className="flex text-12 text-[#F9991E] underline w-[77px] justify-center cursor-pointer"
                                    onClick={() => {
                                      const allDays = workDaysOptions.map(
                                        option => option.value
                                      );
                                      setMainShift({
                                        ...mainShift,
                                        selectedDays: allDays,
                                      });
                                    }}
                                  >
                                    เลือกทุกวัน
                                  </span>
                                </div>

                                <div className="custom-radio-group">
                                  <div className="radio-options">
                                    {workDaysOptions.map(option => (
                                      <Radio.Button
                                        key={option.value}
                                        value={option.value}
                                        className={`radio-button ${
                                          mainShift.selectedDays.includes(
                                            option.value
                                          )
                                            ? 'radio-selected'
                                            : ''
                                        }`}
                                        onClick={() =>
                                          handleDayToggle(
                                            mainShift.id,
                                            option.value,
                                            true
                                          )
                                        }
                                      >
                                        {option.label}
                                      </Radio.Button>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              {/* Time Range Picker */}
                              <div className="mb-6">
                                <div className="text-sm font-regular mb-[10px]">
                                  เวลาที่ทำงาน
                                </div>
                                <TimeRangePicker
                                  value={[
                                    mainShift.startTime
                                      ? dayjs(mainShift.startTime, 'HH:mm')
                                      : null,
                                    mainShift.endTime
                                      ? dayjs(mainShift.endTime, 'HH:mm')
                                      : null,
                                  ]}
                                  onChange={value =>
                                    handleTimeRangeChange(
                                      mainShift.id,
                                      value,
                                      true
                                    )
                                  }
                                />
                              </div>
                            </div>
                          ),
                        },
                      ]}
                    />
                  </Form.Item>

                  {extraShifts.map(shift => (
                    <Form.Item
                      key={shift.id}
                      shouldUpdate
                      rules={[
                        {
                          validator: async () => {
                            const isCompletelyEmpty =
                              shift.selectedDays.length === 0 &&
                              !shift.startTime &&
                              !shift.endTime;

                            if (isCompletelyEmpty) return;

                            if (
                              shift.selectedDays.length === 0 ||
                              !shift.startTime ||
                              !shift.endTime
                            ) {
                              throw new Error(
                                'กรุณากรอกข้อมูลให้ครบถ้วนสำหรับกะเสริม'
                              );
                            }
                          },
                        },
                      ]}
                    >
                      <Collapse
                        key={shift.id}
                        activeKey="1"
                        size="small"
                        className={`mt-4 collapse-item ${
                          isFormSubmitted &&
                          (shift.selectedDays.length === 0 ||
                            !shift.startTime ||
                            !shift.endTime)
                            ? 'error-border'
                            : ''
                        } ${shift.isOverlapping ? 'error-border' : ''}`}
                        items={[
                          {
                            key: '1',
                            label: (
                              <div className="flex justify-between items-center">
                                <span>กะการทำงานเสริม</span>
                                <Image
                                  alt="delete-icon"
                                  preview={false}
                                  width={16}
                                  height={16}
                                  src={'/img/delete-icon.svg'}
                                  onClick={() =>
                                    handleRemoveExtraShift(shift.id)
                                  }
                                  className="cursor-pointer text-20"
                                />
                              </div>
                            ),
                            children: (
                              <div className="flex gap-6">
                                {/* Work Days Selection */}
                                <div className="mb-6">
                                  <div className="flex text-sm font-regular justify-between w-[430px] mb-[10px]">
                                    <span>วันที่ทำงาน</span>
                                  </div>
                                  <div className="custom-radio-group">
                                    <div className="radio-options">
                                      {workDaysOptions.map(option => (
                                        <Radio.Button
                                          key={option.value}
                                          value={option.value}
                                          className={`radio-button ${
                                            shift.selectedDays.includes(
                                              option.value
                                            )
                                              ? 'radio-selected'
                                              : ''
                                          }`}
                                          onClick={() =>
                                            handleDayToggle(
                                              shift.id,
                                              option.value,
                                              false
                                            )
                                          }
                                        >
                                          {option.label}
                                        </Radio.Button>
                                      ))}
                                    </div>
                                  </div>
                                </div>

                                {/* Time Range Picker */}
                                <div className="mb-6">
                                  <div className="text-sm font-regular mb-[10px]">
                                    เวลาที่ทำงาน
                                  </div>
                                  <TimeRangePicker
                                    value={[
                                      shift.startTime
                                        ? dayjs(shift.startTime, 'HH:mm')
                                        : null,
                                      shift.endTime
                                        ? dayjs(shift.endTime, 'HH:mm')
                                        : null,
                                    ]}
                                    onChange={value =>
                                      handleTimeRangeChange(
                                        shift.id,
                                        value,
                                        false
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            ),
                          },
                        ]}
                      />
                    </Form.Item>
                  ))}

                  <div className="py-3 mt-4">
                    <button
                      type="button"
                      className="text-[#F9991E] font-medium flex items-center gap-1"
                      onClick={handleAddExtraShift}
                    >
                      <PlusOutlined /> เพิ่มกะการทำงานใหม่
                    </button>
                  </div>
                </section>

                <Divider />

                <div className="flex w-full justify-end py-[24px]">
                  <CustomButton
                    theme="primary"
                    className="w-[116px] h-[46px]"
                    onClick={() => form.submit()}
                  >
                    เพิ่มสัญญาใหม่
                  </CustomButton>
                </div>
                {showAlert && (
                  <div className="absolute left-0 right-0 bottom-10 w-[395px] justify-self-center">
                    <Alert
                      message={errorMessage}
                      type="error"
                      showIcon
                      closable
                      onClose={() => setShowAlert(false)}
                    />
                  </div>
                )}
              </Form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateContract;
