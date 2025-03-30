'use client';

import { CustomButton } from '@/components/Buttons';
import { createEmployee } from '@/services/Employee';
import {
  ArrowLeftOutlined,
  EditOutlined,
  PlusOutlined,
  SaveOutlined,
  UndoOutlined,
} from '@ant-design/icons';
import {
  Breadcrumb,
  Collapse,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Radio,
  Select,
  Switch,
  Table,
  Typography,
  Upload,
  message,
} from 'antd';
import th from 'antd/es/date-picker/locale/th_TH';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import dayTh from 'dayjs/locale/th';
import buddhistEra from 'dayjs/plugin/buddhistEra';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { CreateEmployeeRequest } from '../../../../../backend/employee';
import './style.css';

dayjs.extend(buddhistEra);
dayjs.locale(dayTh);

const buddhistLocale: typeof th = {
  ...th,
  lang: {
    ...th.lang,
    fieldDateFormat: 'BBBB-MM-DD',
    fieldDateTimeFormat: 'BBBB-MM-DD HH:mm:ss',
    yearFormat: 'BBBB',
    cellYearFormat: 'BBBB',
  },
};

dayjs.extend(buddhistEra);
dayjs.locale('th');

interface CreateEmployeeFormType extends CreateEmployeeRequest {
  age: string;
}

const EmployeeCreation = () => {
  const [isSingle, setIsSingle] = useState(true);
  const router = useRouter();
  const [form] = Form.useForm();
  const [tableForm] = Form.useForm();
  const [isInsuranceEnabled, setInsuranceEnabled] = useState(false);
  const [isSameAddress, setIsSameAddress] = useState(false);
  const [originalData, setOriginalData] = useState<Record<
    string,
    string | null
  > | null>();
  const [collapseActiveKey, setCollapseActiveKey] = useState<string[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<
    (() => void) | null
  >(null);

  //navigation section
  // Intercept navigation and show modal
  const interceptNavigation = (navigate: () => void) => {
    setPendingNavigation(() => navigate);
    setIsModalVisible(true);
  };

  // Override router.push and router.replace
  useEffect(() => {
    const originalPush = router.push;
    const originalReplace = router.replace;

    router.push = (...args: Parameters<typeof router.push>) => {
      interceptNavigation(() => originalPush(...args));
    };

    router.replace = (...args: Parameters<typeof router.replace>) => {
      interceptNavigation(() => originalReplace(...args));
    };

    return () => {
      router.push = originalPush;
      router.replace = originalReplace;
    };
  }, [router]);

  // Handle browser refresh/close
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = ''; // Required for Chrome
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const handleLeavePage = () => {
    setIsModalVisible(false);
    if (pendingNavigation) pendingNavigation();
  };

  const handleStayOnPage = () => {
    setIsModalVisible(false);
    setPendingNavigation(null);
  };

  //navigation part ended

  const [data, setData] = useState<Record<string, string | null>[]>([
    {
      key: '1',
      workPlace: 'Moral Business',
      contractDuration: '2 ปี 10 เดือน',
      jobType: 'กะกลางคืน',
      salary: '9,000',
      reason: 'สาเหตุยาวได้แค่เท่านี้',
    },
    {
      key: '2',
      workPlace: 'Moral Business สาขา 2',
      contractDuration: '8 วัน',
      jobType: 'รับจ้างทั่วไป',
      salary: '15,000',
      reason: 'ลาออกเอง',
    },
  ]);

  const [editingKey, setEditingKey] = useState<string | null>(null);
  const isEditingTable = (record: Record<string, string | null>) =>
    record.key === editingKey;

  const editTableRow = (record: Record<string, string | null>) => {
    // debug
    console.log(record);
    //check if there's blank row, if yes remove
    const blankRowIndex = data.findIndex(isRowEmpty);
    if (blankRowIndex > -1) {
      setData(data.filter((_, index) => index !== blankRowIndex));
    }
    //edit logic
    setEditingKey(record.key);
    setOriginalData({ ...record });
    tableForm.setFieldsValue({ ...record });
  };

  const cancelEditTableRow = () => {
    if (editingKey) {
      const currentRow = data.find(item => item.key === editingKey);
      if (currentRow && isRowEmpty(currentRow)) {
        setData(data.filter(item => item.key !== editingKey));
      } else if (originalData) {
        setData(prevData =>
          prevData.map(item =>
            item.key === originalData.key ? originalData : item
          )
        );
      }
    }
    setEditingKey(null);
    setOriginalData(null);
    tableForm.resetFields();
  };

  const saveTableRow = async (key: string) => {
    try {
      const row = (await tableForm.validateFields()) as Record<
        string,
        string | null
      >;

      if (isRowEmpty(row)) {
        setData(prevData => prevData.filter(item => item.key != key));
        setEditingKey(null);
        setOriginalData(null);
        return;
      }

      const newData = [...data];
      const index = newData.findIndex(item => key === item.key);
      if (index > -1) {
        newData[index] = { ...newData[index], ...row };
        setData(newData);
        setEditingKey(null);
        setOriginalData(null);
      } else {
        setEditingKey(null);
      }
    } catch (errInfo) {
      console.error('Validate Failed:', errInfo);
    }
  };

  const handleDeleteRow = (key: string) => {
    cancelEditTableRow();
    const newData = data.filter(item => item.key !== key);
    setData(newData);
  };

  const handleAdd = () => {
    const hasIncompleteRow = data.some(isRowEmpty);
    if (hasIncompleteRow) {
      return;
    }
    createNewRow();
  };

  const createNewRow = () => {
    const newKey = uuid();
    setData([
      ...data,
      {
        key: newKey,
        workPlace: '',
        contractDuration: '',
        jobType: '',
        salary: '',
        reason: '',
      },
    ]);
    setEditingKey(newKey);
    tableForm.resetFields();
  };

  const isRowEmpty = (row: Record<string, string | null>): boolean => {
    return (
      !row.workPlace &&
      !row.contractDuration &&
      !row.jobType &&
      !row.salary &&
      !row.reason
    );
  };

  const columns = [
    {
      title: 'สถานที่ทำงาน',
      dataIndex: 'workPlace',
      key: 'workPlace',
      width: 180,
    },
    {
      title: 'ระยะเวลาจ้างงาน',
      dataIndex: 'contractDuration',
      key: 'contractDuration',
      width: 120,
    },
    {
      title: 'ลักษณะงาน',
      dataIndex: 'jobType',
      key: 'jobType',
      width: 100,
    },
    {
      title: 'เงินเดือน',
      dataIndex: 'salary',
      key: 'salary',
      width: 80,
    },
    {
      title: 'สาเหตุที่ออก',
      dataIndex: 'reason',
      key: 'reason',
      width: 148,
    },
    {
      title: '',
      dataIndex: 'action',
      width: 72,
      render: (_: any, record: Record<string, string | null>) => {
        const editable = isEditingTable(record);
        return editable ? (
          <span className="flex gap-4 text-[#A3A3A3]">
            <SaveOutlined
              className="text-20"
              onClick={() => saveTableRow(record.key ?? '')}
            />
            <UndoOutlined
              className="text-20 text-[#A3A3A3]"
              onClick={cancelEditTableRow}
            />
          </span>
        ) : (
          <span className="flex gap-4">
            <EditOutlined
              className="text-[#A3A3A3] text-20 cursor-pointer"
              onClick={() => editTableRow(record)}
            />
            <Popconfirm
              title="คุณแน่ใจหรือไม่ที่จะลบ?"
              okText="ตกลง"
              cancelText="ยกเลิก"
              cancelButtonProps={{
                className: 'custom-cancel-button',
              }}
              okButtonProps={{
                style: {
                  backgroundColor: '#F9991E',
                  borderColor: '#F48625',
                  color: 'white',
                },
                className: 'custom-ok-button',
              }}
              onConfirm={() => handleDeleteRow(record.key ?? '')}
            >
              <Image
                alt="delete-icon"
                width={20}
                height={20}
                src={'/img/delete-icon.svg'}
                onClick={cancelEditTableRow}
                className="cursor-pointer text-20"
              />
            </Popconfirm>
          </span>
        );
      },
    },
  ];

  const mergedColumns = columns.map(col => {
    if (col.dataIndex === 'action') {
      return col;
    }
    return {
      ...col,
      onCell: (record: Record<string, string | null>) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditingTable(record),
      }),
    };
  });

  const EditableCell: React.FC<{
    editing: boolean;
    dataIndex: string;
    title: string;
    record: Record<string, string | null>;
    children: React.ReactNode;
  }> = ({ editing, dataIndex, title: _title, children, ...restProps }) => {
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item name={dataIndex} style={{ margin: 0 }}>
            <Input className="" />
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  const parseIsThai = (value: string | boolean): boolean => {
    if (typeof value === 'boolean') {
      return value;
    }
    return value === 'thai';
  };

  const onFinish = async (mainFormValues: CreateEmployeeFormType) => {
    try {
      const { age: _age, ...transformedForm } = mainFormValues;
      const combinedData = {
        ...transformedForm,
        employeeAdditionalInfo: {
          ...transformedForm.additionalInfo,
          workHistory: data,
        },
        employee: {
          ...transformedForm.employee,
          birthDate: transformedForm.employee.birthDate.toISOString(),
          startDate: transformedForm.employee.startDate.toISOString(),
          isThai: parseIsThai(transformedForm.employee.isThai),
        },
      };

      console.log(combinedData);
      const response = await createEmployee(combinedData);
      console.log('Employee creation successful: ', response);
    } catch (errInfo) {
      console.error('Validate Failed:', errInfo);
    }
  };

  const onFinishFailed = ({ errorFields }: any) => {
    if (errorFields.length > 0) {
      form.scrollToField(errorFields[0].name, {
        behavior: 'smooth',
      });
    }
  };

  const handleBirthDateChange = (date: any) => {
    if (!date) {
      form.setFieldsValue({ age: '' });
      return;
    }

    const today = dayjs();
    const birthDate = dayjs(date);
    if (birthDate.isSame(today) || birthDate.isBefore(today)) {
      const age = today.diff(birthDate, 'year');
      form.setFieldsValue({ age: `${age} ปี` });
    } else {
      form.setFieldsValue({ age: 'error' });
    }
  };

  const disableFutureDates = (current: dayjs.Dayjs) => {
    return current && current?.isAfter(dayjs(), 'day');
  };

  const handleMartialStatusChange = (e: any) => {
    const value = e.target.value;
    setIsSingle(value === 'single');

    if (value === 'married') {
      setCollapseActiveKey(['1']);
    }
    if (value === 'single') {
      setCollapseActiveKey(['']);
    }
  };

  const handleCollapseChange = (key: string[] | string) => {
    setCollapseActiveKey(Array.isArray(key) ? key : [key]);
  };

  const handleUpload = (info: any) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} upload failed`);
    }
  };

  useEffect(() => {
    if (isSingle) {
      form.setFieldsValue({
        partnerPronoun: undefined,
        partnerName: undefined,
        partnerSurname: undefined,
        partnerJob: undefined,
        partnerPhoneNum: undefined,
        noOfChildren: undefined,
      });
    }
  });

  return (
    <div className="flex flex-col h-screen">
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
              title: 'รายชื่อพนักงาน',
              href: '/dashboard/employee-management',
            },
            {
              title: 'เพิ่มพนักงาน',
            },
          ]}
        />
        <div className="flex gap-2">
          <ArrowLeftOutlined onClick={() => router.push('/dashboard')} />
          <span className="font-semibold text-20">เพิ่มพนักงานใหม่</span>
        </div>

        <div
          className="w-full overflow-y-auto"
          style={{
            maxHeight: 'calc(100vh - 140px)',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          <div className="flex-1 px-6 pb-10 max-w-[780px]">
            <div className="col-span-2">
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                initialValues={{
                  employee: {
                    isSocialSecurityEnabled: false,
                  },
                }}
              >
                {/* Personal Information Section */}
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <Typography.Text type="danger" className="mr-1">
                    *
                  </Typography.Text>
                  ข้อมูลส่วนตัว
                </h3>

                <div className="flex flex-col gap-4">
                  <div className="flex gap-10 items-center">
                    <div>
                      <div className="flex gap-10 items-center">
                        {/* Picture upload */}
                        <Upload
                          name="logo"
                          showUploadList={false}
                          action="/upload.do" // Replace with real upload API
                          onChange={handleUpload}
                        >
                          <div className="w-[140px] h-[140px]">
                            <Image
                              src={'/img/upload-pic.svg'} //placeholder, replace when have pics
                              width={140}
                              height={140}
                              alt="placeholder"
                              className="w-full h-full object-cover rounded-full"
                            />
                          </div>
                        </Upload>
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <Form.Item
                        label="สัญชาติ"
                        name={['employee', 'isThai']}
                        layout="horizontal"
                      >
                        <div className="ml-8">
                          <Radio.Group
                            buttonStyle="outline"
                            className="flex gap-4"
                          >
                            <Radio value="thai">คนไทย</Radio>
                            <Radio value="foreigners">คนต่างชาติ</Radio>
                          </Radio.Group>
                        </div>
                      </Form.Item>

                      <div className="flex gap-6">
                        <Form.Item
                          label="คำนำหน้า"
                          name={['employee', 'title']}
                          rules={[{ required: true, message: '' }]}
                          className="flex-1 min-w-[92px] hide-asterisk"
                        >
                          <Select placeholder="นางสาว">
                            <Select.Option value="นาย">นาย</Select.Option>
                            <Select.Option value="นาง">นาง</Select.Option>
                            <Select.Option value="นางสาว">นางสาว</Select.Option>
                          </Select>
                        </Form.Item>
                        <Form.Item
                          label="ชื่อจริง"
                          name={['employee', 'name']}
                          rules={[{ required: true, message: '' }]}
                          className="flex-1 min-w-[100px] hide-asterisk"
                        >
                          <Input placeholder="ชื่อจริง" />
                        </Form.Item>
                        <Form.Item
                          label="นามสกุล"
                          name={['employee', 'surname']}
                          rules={[{ required: true, message: '' }]}
                          className="flex-1 min-w-[180px] hide-asterisk"
                        >
                          <Input placeholder="นามสกุล" />
                        </Form.Item>
                        <Form.Item
                          label="ชื่อเล่น"
                          name={['employee', 'nickname']}
                          rules={[{ required: true, message: '' }]}
                          className="flex-1 min-w-[100px] hide-asterisk"
                        >
                          <Input placeholder="ชื่อเล่น" />
                        </Form.Item>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <Form.Item
                      label="เบอร์โทรศัพท์"
                      name={['employee', 'phone']}
                      rules={[{ required: true, message: '' }]}
                      className="flex-1 min-w-[113px] hide-asterisk"
                    >
                      <Input placeholder="081-923-4329" />
                    </Form.Item>
                    <Form.Item
                      label="รหัสบัตรชมพู, เลขพาสปอร์ต"
                      name={['employeeAdditionalInfo', 'citizenId']}
                      rules={[{ required: true, message: '' }]}
                      className="flex-1 min-w-[160px] hide-asterisk"
                    >
                      <Input placeholder="1101283957203" />
                    </Form.Item>
                    <Form.Item
                      label="วันเกิด"
                      name={['employee', 'birthDate']}
                      rules={[{ required: true, message: '' }]}
                      className="flex-1 min-w-[120px] hide-asterisk"
                    >
                      <DatePicker
                        locale={buddhistLocale}
                        placeholder="11-11-2544"
                        disabledDate={disableFutureDates}
                        onChange={handleBirthDateChange}
                        format="DD-MM-BBBB"
                        showNow={false}
                      />
                    </Form.Item>
                    <Form.Item
                      label="อายุ"
                      name="age"
                      className="flex-1 min-w-[32px]"
                    >
                      <Input placeholder="" disabled />
                    </Form.Item>
                    <Form.Item
                      label="ส่วนสูง (ซม.)"
                      name={['employeeAdditionalInfo', 'height']}
                      rules={[{ required: true, message: '' }]}
                      className="flex-1 min-w-[80px] hide-asterisk"
                    >
                      <InputNumber placeholder="160" controls={false} />
                    </Form.Item>
                    <Form.Item
                      label="น้ำหนัก (กก.)"
                      name={['employeeAdditionalInfo', 'weight']}
                      rules={[{ required: true, message: '' }]}
                      className="flex-1 min-w-[76px] hide-asterisk"
                    >
                      <InputNumber placeholder="40" controls={false} />
                    </Form.Item>
                  </div>
                </div>

                <Divider />

                {/* Permanent Address */}
                <h3 className="text-lg font-medium mb-4">
                  ที่อยู่ตามบัตรประชาชน
                </h3>
                <div className="flex gap-4">
                  <Form.Item
                    label="บ้านเลขที่"
                    name={['addresses', 'permanent', 'houseNumber']}
                    rules={[{ required: true, message: '' }]}
                    className="w-[100px]"
                  >
                    <Input placeholder="บ้านเลขที่" />
                  </Form.Item>
                  <Form.Item
                    label="อาคาร /ตึก"
                    name={['addresses', 'permanent', 'building']}
                    className="w-[308px]"
                  >
                    <Input placeholder="One Bangkok" />
                  </Form.Item>
                  <Form.Item
                    label="ชั้น"
                    name={['addresses', 'permanent', 'floor']}
                    className="w-[52px]"
                  >
                    <Input placeholder="12A" />
                  </Form.Item>
                  <Form.Item
                    label="หมู่ที่"
                    name={['addresses', 'permanent', 'village']}
                    className="w-[52px]"
                  >
                    <Input placeholder="หมู่ที่" />
                  </Form.Item>
                  <Form.Item
                    label="ซอย"
                    name={['addresses', 'permanent', 'alley']}
                    className="w-[160px]"
                  >
                    <Input placeholder="ซอย" />
                  </Form.Item>
                </div>

                <div className="flex gap-4">
                  <Form.Item
                    label="ถนน"
                    name={['addresses', 'permanent', 'street']}
                    className="min-w-[156px]"
                  >
                    <Input placeholder="ถนน" />
                  </Form.Item>
                  <Form.Item
                    label="ตำบล / แขวง"
                    name={['addresses', 'permanent', 'subDistrict']}
                    rules={[{ required: true, message: '' }]}
                    className="w-[140px]"
                  >
                    <Input placeholder="ตำบล / แขวง" />
                  </Form.Item>
                  <Form.Item
                    label="อำเภอ / เขต"
                    name={['addresses', 'permanent', 'district']}
                    rules={[{ required: true, message: '' }]}
                    className="w-[140px]"
                  >
                    <Input placeholder="อำเภอ / เขต" />
                  </Form.Item>
                  <Form.Item
                    label="จังหวัด"
                    name={['addresses', 'permanent', 'province']}
                    rules={[{ required: true, message: '' }]}
                    className="w-[120px]"
                  >
                    <Input placeholder="จังหวัด" />
                  </Form.Item>
                  <Form.Item
                    label="รหัสไปรษณีย์"
                    name={['addresses', 'permanent', 'postalCode']}
                    rules={[{ required: true, message: '' }]}
                    className="w-[96px]"
                  >
                    <Input placeholder="รหัสไปรษณีย์" />
                  </Form.Item>
                </div>

                <Divider />

                {/* Current Address */}
                <h3 className="text-lg font-medium mb-4">ที่อยู่ปัจจุบัน</h3>
                <div>
                  <Form.Item
                    label="ที่อยู่ตรงกับบัตรประชาชน"
                    name={['employee', 'isSameAddress']}
                    valuePropName="checked"
                    layout="horizontal"
                    colon={false}
                  >
                    <Switch
                      className="ml-[120px]"
                      onChange={checked => {
                        setIsSameAddress(checked);
                        if (checked) {
                          const permanent =
                            form.getFieldValue(['addresses', 'permanent']) ||
                            {};
                          form.setFieldsValue({
                            addresses: {
                              current: { ...permanent },
                            },
                          });
                        } else {
                          form.setFieldsValue({
                            addresses: {
                              current: {
                                houseNumber: undefined,
                                building: undefined,
                                floor: undefined,
                                village: undefined,
                                alley: undefined,
                                street: undefined,
                                subDistrict: undefined,
                                district: undefined,
                                province: undefined,
                                postalCode: undefined,
                              },
                            },
                          });
                        }
                      }}
                    />
                  </Form.Item>
                </div>
                <div className="flex gap-4">
                  <Form.Item
                    label="บ้านเลขที่"
                    name={['addresses', 'current', 'houseNumber']}
                    rules={[{ required: true, message: '' }]}
                    className="w-[100px]"
                  >
                    <Input placeholder="บ้านเลขที่" disabled={isSameAddress} />
                  </Form.Item>
                  <Form.Item
                    label="อาคาร /ตึก"
                    name={['addresses', 'current', 'building']}
                    className="w-[308px]"
                  >
                    <Input placeholder="One Bangkok" disabled={isSameAddress} />
                  </Form.Item>
                  <Form.Item
                    label="ชั้น"
                    name={['addresses', 'current', 'floor']}
                    className="w-[52px]"
                  >
                    <Input placeholder="12A" disabled={isSameAddress} />
                  </Form.Item>
                  <Form.Item
                    label="หมู่ที่"
                    name={['addresses', 'current', 'village']}
                    className="w-[52px]"
                  >
                    <Input placeholder="หมู่ที่" disabled={isSameAddress} />
                  </Form.Item>
                  <Form.Item
                    label="ซอย"
                    name={['addresses', 'current', 'alley']}
                    className="w-[160px]"
                  >
                    <Input placeholder="ซอย" disabled={isSameAddress} />
                  </Form.Item>
                </div>

                <div className="flex gap-4">
                  <Form.Item
                    label="ถนน"
                    name={['addresses', 'current', 'street']}
                    className="min-w-[156px]"
                  >
                    <Input placeholder="ถนน" disabled={isSameAddress} />
                  </Form.Item>
                  <Form.Item
                    label="ตำบล / แขวง"
                    name={['addresses', 'current', 'subDistrict']}
                    rules={[{ required: true, message: '' }]}
                    className="w-[140px]"
                  >
                    <Input placeholder="ตำบล / แขวง" disabled={isSameAddress} />
                  </Form.Item>
                  <Form.Item
                    label="อำเภอ / เขต"
                    name={['addresses', 'current', 'district']}
                    rules={[{ required: true, message: '' }]}
                    className="w-[140px]"
                  >
                    <Input placeholder="อำเภอ / เขต" disabled={isSameAddress} />
                  </Form.Item>
                  <Form.Item
                    label="จังหวัด"
                    name={['addresses', 'current', 'province']}
                    rules={[{ required: true, message: '' }]}
                    className="w-[120px]"
                  >
                    <Input placeholder="จังหวัด" disabled={isSameAddress} />
                  </Form.Item>
                  <Form.Item
                    label="รหัสไปรษณีย์"
                    name={['addresses', 'current', 'postalCode']}
                    rules={[{ required: true, message: '' }]}
                    className="w-[96px]"
                  >
                    <Input
                      placeholder="รหัสไปรษณีย์"
                      disabled={isSameAddress}
                    />
                  </Form.Item>
                </div>

                <Divider />

                <h3 className="text-lg font-medium mb-4">สถานภาพ</h3>
                <Form.Item
                  name={['employeeAdditionalInfo', 'maritalStatus']}
                  label="สถานะการสมรส"
                  layout="horizontal"
                  rules={[{ required: true, message: '' }]}
                >
                  <div className="ml-8">
                    <Radio.Group
                      buttonStyle="outline"
                      onChange={handleMartialStatusChange}
                      className="flex gap-4"
                    >
                      <Radio value="single">โสด</Radio>
                      <Radio value="married">สมรสแล้ว</Radio>
                    </Radio.Group>
                  </div>
                </Form.Item>
                <div>
                  <Collapse
                    activeKey={collapseActiveKey}
                    onChange={handleCollapseChange}
                    collapsible={isSingle ? 'disabled' : 'header'}
                    items={[
                      {
                        key: '1',
                        label: 'ข้อมูลคู่สมรส',
                        children: (
                          <div>
                            <div className="flex gap-6">
                              <Form.Item
                                label="คำนำหน้า"
                                name={['employeeAdditionalInfo', 'spouseTitle']}
                                className="w-[84px]"
                              >
                                <Select placeholder="คำนำ" disabled={isSingle}>
                                  <Select.Option value="นาย">นาย</Select.Option>
                                  <Select.Option value="นาง">นาง</Select.Option>
                                  <Select.Option value="นางสาว">
                                    นางสาว
                                  </Select.Option>
                                </Select>
                              </Form.Item>
                              <Form.Item
                                label="ชื่อจริง"
                                name={['employeeAdditionalInfo', 'spouseName']}
                                className="w-[120px]"
                              >
                                <Input
                                  placeholder="มาเรียม"
                                  disabled={isSingle}
                                />
                              </Form.Item>
                              <Form.Item
                                label="นามสกุล"
                                name={[
                                  'employeeAdditionalInfo',
                                  'spouseSurname',
                                ]}
                                className="w-[180px]"
                              >
                                <Input
                                  placeholder="นามสกุลที่ยาวที่สุดได้เท่านี้"
                                  disabled={isSingle}
                                />
                              </Form.Item>
                            </div>
                            <div className="flex gap-6">
                              <Form.Item
                                label="อาชีพคู่สมรส"
                                name={[
                                  'employeeAdditionalInfo',
                                  'spouseOccupation',
                                ]}
                                className="w-[180px]"
                              >
                                <Input
                                  placeholder="พนักงานบริษัท"
                                  disabled={isSingle}
                                />
                              </Form.Item>
                              <Form.Item
                                label="เบอร์โทรศัพท์ของคู่สมรส"
                                name={['employeeAdditionalInfo', 'spousePhone']}
                                className="w-[160px]"
                              >
                                <Input
                                  placeholder="092-123-5326"
                                  disabled={isSingle}
                                />
                              </Form.Item>
                              <Form.Item
                                label="จำนวนบุตร"
                                name={[
                                  'employeeAdditionalInfo',
                                  'childrenCount',
                                ]}
                                className="w-[80px]"
                              >
                                <InputNumber
                                  placeholder="2"
                                  controls={false}
                                  disabled={isSingle}
                                />
                              </Form.Item>
                            </div>
                          </div>
                        ),
                      },
                    ]}
                  />
                </div>

                <Divider />

                <h3 className="text-lg font-medium mb-4">ข้อมูลด้านสุขภาพ</h3>
                <div className="flex">
                  <Form.Item
                    label="โรคประจำตัว"
                    name={['employeeAdditionalInfo', 'medicalConditions']}
                    className="w-[400px]"
                  >
                    <Input placeholder="ตัวอย่าง: โรคภูมิแพ้   โรคหัวใจ   หมอนรองกระดูกทับเส้นประสาท" />
                  </Form.Item>
                </div>

                <Divider />

                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <Typography.Text type="danger" className="mr-1">
                    *
                  </Typography.Text>
                  การศึกษา
                </h3>
                <div className="flex flex-col">
                  <div className="flex gap-6">
                    <Form.Item
                      label="ระดับการศึกษาสูงสุด"
                      name={['employeeAdditionalInfo', 'educationHighest']}
                      className="w-[280px] hide-asterisk"
                      rules={[{ required: true, message: '' }]}
                    >
                      <Select placeholder="ประกาศนียบัตรวิชาชีพชั้นสูง (ปวส.)">
                        <Select.Option value="elementary">
                          ประถมศึกษา
                        </Select.Option>
                        <Select.Option value="junior-high">
                          มัธยมศึกษาปีที่ 3 (ม.3)
                        </Select.Option>
                        <Select.Option value="senior-high">
                          มัธยมศึกษาปีที่ 6 (ม.6)
                        </Select.Option>
                        <Select.Option value="vocational-cert">
                          ประกาศนียบัตรวิชาชีพ (ปวช.)
                        </Select.Option>
                        <Select.Option value="higher-vocational-cert">
                          ประกาศนียบัตรวิชาชีพชั้นสูง (ปวส.)
                        </Select.Option>
                        <Select.Option value="bachelors-degree">
                          ปริญญาตรี (Bachelor’s Degree)
                        </Select.Option>
                      </Select>
                    </Form.Item>
                    <Form.Item
                      label="สาขา"
                      name={['employeeAdditionalInfo', 'educationMajor']}
                      className="w-[292px] hide-asterisk"
                      rules={[{ required: true, message: '' }]}
                    >
                      <Input placeholder="ศิลปศาสตรบัณฑิต (ศศ.บ.)" />
                    </Form.Item>
                    <Form.Item
                      label="คะแนน"
                      name={['employeeAdditionalInfo', 'educationGpax']}
                      className="w-[80px] hide-asterisk"
                      rules={[{ required: true, message: '' }]}
                    >
                      <InputNumber placeholder="4.00" controls={false} />
                    </Form.Item>
                  </div>
                  <div>
                    <Form.Item
                      label="ชื่อสถานศึกษา"
                      name={['employeeAdditionalInfo', 'educationName']}
                      className="w-[400px] hide-asterisk"
                      rules={[{ required: true, message: '' }]}
                    >
                      <Input placeholder="โรงเรียนนวมินทราชินูทิศ เตรียมอุดมศึกษาน้อมเกล้า" />
                    </Form.Item>
                  </div>
                </div>

                <Divider />

                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <Typography.Text type="danger" className="mr-1">
                    *
                  </Typography.Text>
                  ข้อมูลประกันสังคม
                </h3>
                <div className="flex flex-col">
                  <Form.Item
                    label="รับสิทธิ์ประกันสังคม"
                    name={['employee', 'isSocialSecurityEnabled']}
                    valuePropName="checked"
                    layout="horizontal"
                    colon={false}
                  >
                    <Switch
                      className="ml-[120px]"
                      onChange={checked => {
                        setInsuranceEnabled(checked);
                        if (!checked) {
                          form.setFieldsValue({ hospital: undefined });
                        }
                      }}
                    />
                  </Form.Item>

                  <div className="flex gap-3">
                    <Form.Item
                      label="โรงพยาบาล"
                      name={[
                        'employeeAdditionalInfo',
                        'socialSecurityHospitalName',
                      ]}
                      className="w-[400px]"
                    >
                      <Input
                        placeholder="โรงพยาบาลศิริราชปิยมหาราชการุณย์"
                        disabled={!isInsuranceEnabled}
                      />
                    </Form.Item>

                    <Form.Item
                      label="เลขประกันสังคม"
                      name={['employeeAdditionalInfo', 'socialSecurityId']}
                      className="min-w-[188px]"
                    >
                      <Input
                        placeholder="1-2345-67890-12-3"
                        disabled={!isInsuranceEnabled}
                      />
                    </Form.Item>
                  </div>
                </div>

                <Divider />

                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <Typography.Text type="danger" className="mr-1">
                    *
                  </Typography.Text>
                  บุคคลที่ติดต่อกรณีฉุกเฉิน
                </h3>
                <div className="flex">
                  <div className="flex gap-6">
                    <Form.Item
                      label="ชื่อ - นามสกุล"
                      name={['employeeAdditionalInfo', 'emergencyName']}
                      className="w-[300px] hide-asterisk"
                      rules={[{ required: true, message: '' }]}
                    >
                      <Input placeholder="มาเรียม" />
                    </Form.Item>
                    <Form.Item
                      label="เกี่ยวข้องเป็น"
                      name={['employeeAdditionalInfo', 'emergencyRelation']}
                      className="w-[212px] hide-asterisk"
                      rules={[{ required: true, message: '' }]}
                    >
                      <Input placeholder="มารดา" />
                    </Form.Item>
                    <Form.Item
                      label="เบอร์โทรศัพท์"
                      name={['employeeAdditionalInfo', 'emergencyPhone']}
                      className="w-[140px] hide-asterisk"
                      rules={[{ required: true, message: '' }]}
                    >
                      <Input placeholder="081-923-4329" />
                    </Form.Item>
                  </div>
                </div>

                <Divider />

                {/* Employment History - On hold, need more information */}
                <div className="flex justify-between">
                  <h3 className="text-lg font-medium mb-4">ประวัติการทำงาน</h3>
                </div>
                <Form form={tableForm} component={false}>
                  <Table
                    dataSource={data}
                    columns={mergedColumns}
                    pagination={false}
                    rowKey="key"
                    locale={{ emptyText: null }}
                    className={data.length === 0 ? 'table-no-data' : ''}
                    rowClassName={(_, index) =>
                      index % 2 === 0 ? 'bg-[]' : 'bg-[#FAFAFA]'
                    }
                    components={{
                      body: {
                        cell: EditableCell,
                      },
                    }}
                    footer={() => (
                      <div
                        className="flex items-center cursor-pointer text-disable"
                        onClick={handleAdd}
                        style={{
                          marginTop: '0.5px',
                          borderBottom: '1px solid #F5F5F5',
                          paddingBottom: '17.5px',
                          marginLeft: '-16px',
                          marginRight: '484px',
                          paddingLeft: '16px',
                          paddingRight: '16px',
                        }}
                      >
                        <PlusOutlined className="mr-2" />
                        เพิ่มรายการใหม่ที่นี่
                      </div>
                    )}
                  />
                </Form>

                <Divider />

                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <Typography.Text type="danger" className="mr-1">
                    *
                  </Typography.Text>
                  รายละเอียดการจ้างงาน
                </h3>

                <div className="flex gap-6">
                  <Form.Item
                    name={['employee', 'position']}
                    label="ตำแหน่งงาน"
                    rules={[{ required: true, message: '' }]}
                    className="hide-asterisk w-[200px]"
                  >
                    <Select className="flex gap-4" placeholder="แม่บ้านประจำ">
                      <Select.Option value="FULLTIMEMAID">
                        แม่บ้านประจำ
                      </Select.Option>
                      <Select.Option value="SPAREMAID">สแปร์</Select.Option>
                      <Select.Option value="SPAREMAIDCASH">
                        สแปร์เงินสด
                      </Select.Option>
                      <Select.Option value="INSPECTOR">สายตรวจ</Select.Option>
                      <Select.Option value="SALE">ธุรการ</Select.Option>
                      <Select.Option value="HR">ฝ่ายบุคคล</Select.Option>
                      <Select.Option value="STOCK">ฝ่ายขาย</Select.Option>
                      <Select.Option value="DELIVERY">ฝ่ายจัดส่ง</Select.Option>
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name={['employee', 'startDate']}
                    label="วันที่เริ่มงาน"
                    rules={[{ required: true, message: '' }]}
                    className="hide-asterisk"
                  >
                    <DatePicker
                      locale={buddhistLocale}
                      placeholder="11-11-2544"
                      format="DD-MM-BBBB"
                      className="w-[176px]"
                    />
                  </Form.Item>
                </div>

                <div className="flex justify-end my-6">
                  <CustomButton
                    theme="primary"
                    htmlType="submit"
                    className="px-4 py-3 h-[48px]"
                  >
                    สร้างพนักงานใหม่
                  </CustomButton>
                </div>
              </Form>
            </div>
          </div>
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
              คุณแน่ใจหรือไม่ว่าต้องการออกจากหน้านี้
            </div>
          }
          open={isModalVisible}
          onCancel={handleStayOnPage}
          closeIcon={false}
          footer={[
            <div className="flex justify-center gap-10" key="footer">
              <CustomButton
                key="stay"
                theme="flat"
                onClick={handleStayOnPage}
                className="h-[46px] w-[111px]"
              >
                กลับไปแก้ไข
              </CustomButton>
              <CustomButton
                key="leave"
                theme="primary"
                onClick={handleLeavePage}
                className="h-[46px] w-[111px]"
              >
                ออกจากหน้านี้
              </CustomButton>
            </div>,
          ]}
        ></Modal>
      </div>
    </div>
  );
};

export default EmployeeCreation;
