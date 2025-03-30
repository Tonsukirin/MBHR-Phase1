'use client';

import { Alert, Form, Input, Modal, Table, TableColumnsType } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { PayrollExtraType, payrollExtraTable } from './MockData';
import { PlusOutlined } from '@ant-design/icons';
import './style.css';
import { CustomButton } from '@/components/Buttons';
import Search from 'antd/es/input/Search';
import { MonthSelector } from '@/components/Calendar/MonthSelector';
import dayjs, { Dayjs } from 'dayjs';
import { useRouter } from 'next/navigation';
import { v4 as uuid } from 'uuid';
import InputSearchList, {
  SearchInputType,
} from '@/components/InputSearchList/InputSearchList';

type PayrollExtraRow = PayrollExtraType & {
  key: string;
};

const PayrollExtraTable: React.FC = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState<PayrollExtraRow[]>(
    payrollExtraTable.map(item => ({ ...item, key: item.employeeId }))
  );
  const [editingKey, setEditingKey] = useState<string>('');
  const [editingExtraPayKey, setEditingExtraPayKey] = useState<string>('');
  const [editingNoteKey, setEditingNoteKey] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<Dayjs>(dayjs());
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [pendingNavigation, setPendingNavigation] = useState<
    (() => void) | null
  >(null);
  const [selectedEmployee, setSelectedEmployee] =
    useState<SearchInputType | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const router = useRouter();

  const isEditing = (record: PayrollExtraRow) => record.key === editingKey;

  const isNewRow = (record: PayrollExtraRow) =>
    isEditing(record) && !record.employeeId;

  const getDisbursementColumns = (
    cancel: (record: PayrollExtraRow) => void
  ): TableColumnsType<PayrollExtraRow> => [
    {
      title: 'ลำดับ',
      dataIndex: 'index',
      width: 60,
      render: (_, _record: PayrollExtraRow, index: number) => (
        <span>{index + 1}</span>
      ),
    },
    {
      title: 'รหัส',
      dataIndex: 'employeeId',
      width: 88,
      sorter: (a: PayrollExtraRow, b: PayrollExtraRow) => {
        const [prefixA, suffixA] = a.employeeId.split('-').map(Number);
        const [prefixB, suffixB] = b.employeeId.split('-').map(Number);
        if (prefixA !== prefixB) {
          return prefixA - prefixB;
        }
        return suffixA - suffixB;
      },
      render: (text: string, record: PayrollExtraRow) => {
        if (isNewRow(record)) {
          return {
            children: (
              <Form.Item
                name="employeeId"
                className="m-0 mt-[-4.5px] mb-[-5.5px]"
                style={{ marginBottom: 0 }}
                rules={[{ required: true, message: '' }]}
              >
                <InputSearchList
                  type="employee"
                  onSelectOption={(selectedOption: SearchInputType) => {
                    console.log('Selected Employee Id: ', selectedOption);
                    setSelectedEmployee(selectedOption);
                  }}
                />
              </Form.Item>
            ),
            props: { colSpan: 2 },
          };
        }
        return <span>{text}</span>;
      },
    },
    {
      title: 'พนักงาน',
      dataIndex: 'employeeName',
      render: (text: string, record: PayrollExtraRow) => {
        // Hide this cell when in editing state
        if (isNewRow(record)) {
          return { props: { colSpan: 0 } };
        }
        return <span>{text}</span>;
      },
    },
    {
      title: 'เงินพิเศษ',
      dataIndex: 'extraPay',
      width: 116,
      render: (value: number, record: PayrollExtraRow) => {
        if (isNewRow(record)) {
          return (
            <Form.Item
              name="extraPay"
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
              style={{ margin: 0 }}
            >
              <Input
                suffix={<span className="text-disable">฿</span>}
                autoComplete="off"
                onPressEnter={() => saveNewRow(record)}
                onKeyDown={e => {
                  if (e.key === 'Escape') {
                    cancel(record);
                  }
                }}
              />
            </Form.Item>
          );
        } else if (record.key === editingExtraPayKey) {
          return (
            <Form.Item
              name={`extraPay-${record.key}`}
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
              style={{ margin: 0 }}
            >
              <Input
                suffix={<span className="text-disable">฿</span>}
                autoComplete="off"
                autoFocus
                onPressEnter={() => saveExtraPay(record)}
                onKeyDown={e => {
                  if (e.key === 'Escape') {
                    setEditingExtraPayKey('');
                    form.resetFields([`extraPay-${record.key}`]);
                  }
                }}
              />
            </Form.Item>
          );
        }
        return (
          <div
            className="group cursor-pointer"
            onClick={() => {
              setEditingExtraPayKey(record.key);
              form.setFieldsValue({
                [`extraPay-${record.key}`]: record.extraPay,
              });
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
      title: 'หมายเหตุ',
      dataIndex: 'note',
      render: (value: string, record: PayrollExtraRow) => {
        if (isNewRow(record)) {
          return (
            <Form.Item
              name="note"
              className="m-0 mt-[-4.5px] mb-[-5.5px]"
              style={{ margin: 0 }}
            >
              <Input
                autoComplete="off"
                onPressEnter={() => saveNewRow(record)}
                placeholder="ใส่หมายเหตุ (ถ้ามี)"
                onKeyDown={e => {
                  if (e.key === 'Escape') {
                    cancel(record);
                  }
                }}
              />
            </Form.Item>
          );
        } else if (record.key === editingNoteKey) {
          return (
            <Form.Item
              name={`note-${record.key}`}
              className="m-0 mt-[-4.5px] mb-[-5.5px]"
              style={{ margin: 0 }}
            >
              <Input
                autoComplete="off"
                autoFocus
                onPressEnter={() => saveNote(record)}
                placeholder="ใส่หมายเหตุ (ถ้ามี)"
                onKeyDown={e => {
                  if (e.key === 'Escape') {
                    setEditingNoteKey('');
                    form.resetFields([`note-${record.key}`]);
                  }
                }}
              />
            </Form.Item>
          );
        }
        return (
          <div
            className="group cursor-pointer"
            onClick={() => {
              setEditingNoteKey(record.key);
              form.setFieldsValue({
                [`note-${record.key}`]: record.note,
              });
            }}
          >
            <span
              className={`block transition ${
                !value ? 'invisible group-hover:visible' : ''
              }`}
            >
              {value ? (
                value
              ) : (
                <div className="flex gap-2 items-center justify-left">
                  <PlusOutlined className="text-disable" />
                  <span className="text-gray-400">กรอกหมายเหตุ</span>
                </div>
              )}
            </span>
          </div>
        );
      },
    },
  ];

  const cancel = (record: PayrollExtraRow) => {
    if (isNewRow(record)) {
      setData(prevData => prevData.filter(item => item.key !== record.key));
    }
    setEditingKey('');
    form.resetFields();
    setSelectedEmployee(null);
  };

  // Local row save after validation
  const saveExtraPay = async (record: PayrollExtraRow) => {
    try {
      const values = await form.validateFields([`extraPay-${record.key}`]);
      const newData = [...data];
      const index = newData.findIndex(item => item.key === record.key);
      if (index > -1) {
        newData[index].extraPay = values[`extraPay-${record.key}`];
        setData(newData);
        setEditingExtraPayKey('');
        form.resetFields([`extraPay-${record.key}`]);
      }
    } catch (err) {
      console.error('Save Extra Pay failed:', err);
    }
  };

  const saveNote = async (record: PayrollExtraRow) => {
    try {
      const values = await form.validateFields([`note-${record.key}`]);
      const newData = [...data];
      const index = newData.findIndex(item => item.key === record.key);
      if (index > -1) {
        newData[index].note = values[`note-${record.key}`];
        setData(newData);
        setEditingNoteKey('');
        form.resetFields([`note-${record.key}`]);
      }
    } catch (err) {
      console.error('Save Note failed:', err);
    }
  };

  const saveNewRow = async (record: PayrollExtraRow) => {
    try {
      const values = await form.validateFields([
        'employeeId',
        'extraPay',
        'note',
      ]);
      const newData = [...data];
      const index = newData.findIndex(item => item.key === record.key);
      if (index > -1) {
        newData[index] = {
          ...newData[index],
          employeeId: selectedEmployee ? selectedEmployee?.id : '',
          employeeName: selectedEmployee ? selectedEmployee?.name : '',
          extraPay: values.extraPay,
          note: values.note,
        };
        setData(newData);
        setEditingKey('');
        form.resetFields(['employeeId', 'extraPay', 'note']);
      }
    } catch (err) {
      console.error('Save new row error:', err);
    }
  };

  //Global form submission, POST API/PUT API
  const onFinish = async () => {
    try {
      //Remove key from final form submission
      const payload = data.map(({ key: _key, ...data }) => data);
      console.log('form submission: ', payload);
      setSuccessMessage('บันทึกข้อมูลการเพิ่มเงินพิเศษสำเร็จ');
    } catch (error) {
      console.error('form submission failed: ', error);
    }
  };

  const handleAddRow = () => {
    if (editingKey) return;
    createNewRow();
  };

  const createNewRow = () => {
    const newKey = uuid();
    const newRow: PayrollExtraRow = {
      key: newKey,
      employeeId: '',
      employeeName: '',
      extraPay: 0,
      note: '',
    };
    setData([...data, newRow]);
    setEditingKey(newKey);
    form.resetFields();
    setSelectedEmployee(null);
  };

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
          <MonthSelector value={currentDate} onChange={setCurrentDate} />
        </div>
      </div>
      <Form form={form} onFinish={onFinish} onFinishFailed={() => {}}>
        <Table<PayrollExtraRow>
          dataSource={data}
          columns={getDisbursementColumns(cancel)}
          rowKey="key"
          pagination={false}
          locale={{ emptyText: null }}
          rootClassName={`${data.length === 0 ? 'no-data' : ''} text-nowrap ${
            editingKey ? 'editing-row-style' : ''
          }`}
          rowClassName={(_, index) =>
            `custom-row ${index % 2 === 0 ? 'even-row' : 'odd-row'}`
          }
          scroll={{ y: 'calc(100vh - 430px)' }}
          summary={tableData => {
            if (editingKey) return null;
            const index = tableData.length;
            return (
              <Table.Summary.Row>
                <Table.Summary.Cell
                  index={index}
                  colSpan={5}
                  className={`custom-row ${
                    index % 2 === 0 ? 'even-row' : 'odd-row'
                  }`}
                >
                  <div
                    className="flex items-center cursor-pointer text-disable"
                    onClick={handleAddRow}
                  >
                    <PlusOutlined className="mr-2" />
                    เพิ่มรายการใหม่ที่นี่
                  </div>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            );
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
        </div>
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

export default PayrollExtraTable;
