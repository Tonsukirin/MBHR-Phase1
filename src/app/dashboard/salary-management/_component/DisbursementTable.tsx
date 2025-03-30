'use client';

import { CustomButton } from '@/components/Buttons';
import { MonthSelector } from '@/components/Calendar/MonthSelector';
import { PlusOutlined } from '@ant-design/icons';
import { Alert, Form, Input, Modal, Table, TableColumnsType } from 'antd';
import Search from 'antd/es/input/Search';
import dayjs, { Dayjs } from 'dayjs';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { DisbursementDataType, disbursementTable } from './MockData';
import './style.css';

const DisbursementTable: React.FC = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState<DisbursementDataType[]>(disbursementTable);
  const [editingKey, setEditingKey] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<Dayjs>(dayjs());
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [pendingNavigation, setPendingNavigation] = useState<
    (() => void) | null
  >(null);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const router = useRouter();

  const getDisbursementColumns = (
    isEditing: (record: DisbursementDataType) => boolean,
    edit: (record: DisbursementDataType) => void,
    save: (record: DisbursementDataType) => void,
    cancel: (record: DisbursementDataType) => void
  ): TableColumnsType<DisbursementDataType> => [
    {
      title: 'ลำดับ',
      dataIndex: 'index',
      width: 60,
      render: (_, _record: DisbursementDataType, index: number) => (
        <span>{index + 1}</span>
      ),
    },
    {
      title: 'รหัส',
      dataIndex: 'employeeId',
      width: 88,
      sorter: (a: DisbursementDataType, b: DisbursementDataType) => {
        const [prefixA, suffixA] = a.employeeId.split('-').map(Number);
        const [prefixB, suffixB] = b.employeeId.split('-').map(Number);
        if (prefixA !== prefixB) {
          return prefixA - prefixB;
        }
        return suffixA - suffixB;
      },
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: 'พนักงาน',
      dataIndex: 'employeeName',
    },
    {
      title: 'เงินเดือนโดยประมาณ',
      dataIndex: 'estimatedSalary',
      width: 154,
      render: (value: number) => (
        <span className="text-[#6B6B6B]">
          {value ? value.toLocaleString() : ''}
        </span>
      ),
    },
    {
      title: 'เบิกเงิน',
      dataIndex: 'disbursement',
      width: 116,
      render: (value: number, record: DisbursementDataType) => {
        return isEditing(record) ? (
          <Form.Item
            name="disbursement"
            className="m-0 mt-[-4.5px] mb-[-5.5px]"
            rules={[
              {
                validator: (_, value) => {
                  if (isNaN(Number(value))) {
                    return Promise.reject('');
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input
              onAbort={() => cancel}
              suffix={<span className="text-disable">฿</span>}
              autoComplete="off"
              autoFocus
              onPressEnter={() => {
                const value = form.getFieldValue('disbursement');
                if (Number(value) === 0) {
                  cancel(record);
                }
                save(record);
              }}
              onKeyDown={e => {
                if (e.key === 'Escape') {
                  cancel(record);
                }
              }}
            />
          </Form.Item>
        ) : (
          <div
            className="group cursor-pointer"
            onClick={() => {
              edit(record);
            }}
          >
            <span
              className={`block transition ${
                !value ? 'invisible group-hover:visible' : ''
              }`}
            >
              {value > 0 ? (
                Number(value).toLocaleString()
              ) : (
                <div className="flex gap-2 items-center justify-center">
                  <PlusOutlined className="text-disable" />
                  <span className="text-gray-400">ระบุจำนวนเงิน</span>
                </div>
              )}
            </span>
          </div>
        );
      },
    },
    {
      title: 'ค่าธรรมเนียม',
      dataIndex: 'fee',
      width: 116,
      render: (_, record: DisbursementDataType) => {
        return record.disbursement ? (
          <span className="text-inactive">10</span>
        ) : (
          ''
        );
      },
    },
  ];

  const interceptNavigation = useCallback(
    (navigate: () => void) => {
      if (editingKey) {
        setPendingNavigation(() => navigate);
        setIsModalVisible(true);
      } else {
        navigate();
      }
    },
    [editingKey]
  );

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
  }, [router, editingKey, interceptNavigation]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (editingKey) {
        event.preventDefault();
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [editingKey]);

  const handleStayOnPage = () => {
    setIsModalVisible(false);
    setPendingNavigation(null);
  };

  const handleLeavePage = () => {
    setEditingKey('');
    setIsModalVisible(false);
    if (pendingNavigation) {
      pendingNavigation();
      setPendingNavigation(null);
    }
  };

  const isEditing = (record: DisbursementDataType) =>
    record.employeeId === editingKey;

  const edit = (record: DisbursementDataType) => {
    form.setFieldsValue({ disbursement: record.disbursement });
    setEditingKey(record.employeeId);
  };

  const cancel = () => {
    console.log('cancel');
    setEditingKey('');
    form.resetFields(['disbursement']);
  };

  const onFinish = async () => {
    // POST API
    try {
      console.log('All row data: ', data);
      setSuccessMessage('บันทึกข้อมูลการเบิกเงินสำเร็จ');
    } catch {
      console.error('form submission failed');
    }
  };

  const onFinishFailed = async () => {
    console.log('finished failed');
  };

  const save = async (record: DisbursementDataType) => {
    try {
      const row = (await form.validateFields()) as { disbursement: number };
      const newData = [...data];
      const index = newData.findIndex(
        item => item.employeeId === record.employeeId
      );
      if (index > -1) {
        newData[index] = { ...newData[index], disbursement: row.disbursement };
        setData(newData);
        setEditingKey('');
        form.resetFields(['disbursement']);
      } else {
        setEditingKey('');
      }
    } catch (errInfo) {
      console.error('Validate Failed:', errInfo);
    }
  };

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-4 items-center">
        <Search
          size="large"
          placeholder="ค้นหาชื่อพนักงาน หรือ รหัสพนักงานที่นี่"
          allowClear
        />
        <div className="flex items-center justify-self-center">
          {/* gotta have API handling for onChange */}
          <MonthSelector value={currentDate} onChange={setCurrentDate} />
        </div>
      </div>
      <Form form={form} onFinish={onFinish} onFinishFailed={onFinishFailed}>
        <Table<DisbursementDataType>
          dataSource={data}
          columns={getDisbursementColumns(isEditing, edit, save, cancel)}
          rowKey="employeeId"
          pagination={false}
          locale={{ emptyText: null }}
          rootClassName={`${data.length === 0 ? 'no-data' : ''} text-nowrap ${
            editingKey ? 'editing-row-style' : ''
          }`}
          rowClassName={(_, index) =>
            `custom-row ${index % 2 === 0 ? 'even-row' : 'odd-row'}`
          }
          scroll={{
            y: 'calc(100vh - 430px)',
          }}
        />
        <div className="flex justify-end pt-6">
          <CustomButton
            theme="primary"
            className="fixed w-[104px] h-[46px] bottom-10"
            htmlType="submit"
          >
            บันทึก
          </CustomButton>
          {successMessage && (
            <div className="fixed bottom-[40px] left-1/2 transform -translate-x-1/2">
              <Alert
                message={successMessage}
                type="success"
                showIcon
                closable
                onClose={() => setSuccessMessage('')}
              />
            </div>
          )}
        </div>
      </Form>
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
            คุณยังไม่ได้บันทึกข้อมูล <br />
            ต้องการจะออกจากหน้านี้โดยไม่บันทึกหรือไม่?
          </div>
        }
        open={isModalVisible}
        onCancel={handleStayOnPage}
        closeIcon={false}
        centered
        footer={[
          <div key="footer" className="flex justify-center gap-10">
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
      />
    </div>
  );
};

export default DisbursementTable;
