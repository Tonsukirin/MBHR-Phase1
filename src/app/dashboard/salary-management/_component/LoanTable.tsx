'use client';

import { CustomButton } from '@/components/Buttons';
import { MonthSelector } from '@/components/Calendar/MonthSelector';
import InputSearchList, {
  SearchInputType,
} from '@/components/InputSearchList/InputSearchList';
import { PlusOutlined } from '@ant-design/icons';
import { Alert, Form, Input, Modal, Table, TableColumnsType } from 'antd';
import Search from 'antd/es/input/Search';
import dayjs, { Dayjs } from 'dayjs';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { LoanTableType, loanTable } from './MockData';
import './style.css';

type LoanTableRow = LoanTableType & {
  key: string;
};

const UniformTable: React.FC = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState<LoanTableRow[]>(
    loanTable.map(item => ({ ...item, key: item.employeeId }))
  );
  const [editingKey, setEditingKey] = useState<string>('');
  const [editingLoanKey, setEditingLoanKey] = useState<string>('');
  const [editingInterestKey, setEditingInterestKey] = useState<string>('');
  const [editingLoanDeductionKey, setEditingLoanDeductionKey] =
    useState<string>('');
  const [currentDate, setCurrentDate] = useState<Dayjs>(dayjs());
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [pendingNavigation, setPendingNavigation] = useState<
    (() => void) | null
  >(null);
  const [selectedEmployee, setSelectedEmployee] =
    useState<SearchInputType | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const router = useRouter();

  const isEditing = (record: LoanTableRow) => record.key === editingKey;

  const isNewRow = (record: LoanTableRow) =>
    isEditing(record) && !record.employeeId;

  const getDisbursementColumns = (
    cancel: (record: LoanTableRow) => void
  ): TableColumnsType<LoanTableRow> => [
    {
      title: 'ลำดับ',
      dataIndex: 'index',
      width: 60,
      render: (_, _record: LoanTableRow, index: number) => (
        <span>{index + 1}</span>
      ),
    },
    {
      title: 'รหัส',
      dataIndex: 'employeeId',
      width: 88,
      sorter: (a: LoanTableRow, b: LoanTableRow) => {
        const [prefixA, suffixA] = a.employeeId.split('-').map(Number);
        const [prefixB, suffixB] = b.employeeId.split('-').map(Number);
        if (prefixA !== prefixB) {
          return prefixA - prefixB;
        }
        return suffixA - suffixB;
      },
      render: (text: string, record: LoanTableRow) => {
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
      render: (text: string, record: LoanTableRow) => {
        // Hide this cell when in editing state
        if (isNewRow(record)) {
          return { props: { colSpan: 0 } };
        }
        return <span>{text}</span>;
      },
    },
    {
      title: 'หนี้ค้างชำระ',
      dataIndex: 'outstandingDebt',
      width: 116,
      render: (value: number) => (
        <span>{value ? value.toLocaleString() : ''}</span>
      ),
    },
    {
      title: 'เงินกู้ (เบิกใหม่)',
      dataIndex: 'loan',
      width: 116,
      render: (value: number, record: LoanTableRow) => {
        if (isNewRow(record)) {
          return (
            <Form.Item
              name="loan"
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
        } else if (record.key === editingLoanKey) {
          return (
            <Form.Item
              name={`loan-${record.key}`}
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
                onPressEnter={() => saveLoan(record)}
                onKeyDown={e => {
                  if (e.key === 'Escape') {
                    setEditingLoanKey('');
                    form.resetFields([`loan-${record.key}`]);
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
              setEditingLoanKey(record.key);
              form.setFieldsValue({
                [`loan-${record.key}`]: record.loan,
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
      title: 'ดอกเบี้ย',
      dataIndex: 'interest',
      width: 116,
      render: (value: number, record: LoanTableRow) => {
        if (isNewRow(record)) {
          return (
            <Form.Item
              name="interest"
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
                suffix={<span className="text-disable">%</span>}
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
        } else if (record.key === editingInterestKey) {
          return (
            <Form.Item
              name={`interest-${record.key}`}
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
                onPressEnter={() => saveInterest(record)}
                onKeyDown={e => {
                  if (e.key === 'Escape') {
                    setEditingInterestKey('');
                    form.resetFields([`interest-${record.key}`]);
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
              setEditingInterestKey(record.key);
              form.setFieldsValue({
                [`interest-${record.key}`]: record.interest,
              });
            }}
          >
            <span
              className={`block transition ${
                !value ? 'invisible group-hover:visible' : ''
              }`}
            >
              {value > 0 ? (
                record.loan ? (
                  <span>
                    {Number(record.loan * (value / 100)).toLocaleString()}{' '}
                    <span className="text-inactive">({value}%)</span>
                  </span>
                ) : (
                  0
                )
              ) : (
                <div className="flex gap-2 items-center justify-center">
                  <PlusOutlined className="text-disable" />
                  <span className="text-gray-400">ระบุดอกเบี้ย</span>
                </div>
              )}
            </span>
          </div>
        );
      },
    },
    {
      title: 'หักเงินกู้',
      dataIndex: 'loanDeduction',
      width: 116,
      render: (value: number, record: LoanTableRow) => {
        if (isNewRow(record)) {
          return (
            <Form.Item
              name="loanDeduction"
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
        } else if (record.key === editingLoanDeductionKey) {
          return (
            <Form.Item
              name={`loanDeduction-${record.key}`}
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
                onPressEnter={() => saveLoanDeduction(record)}
                onKeyDown={e => {
                  if (e.key === 'Escape') {
                    setEditingLoanDeductionKey('');
                    form.resetFields([`loanDeduction-${record.key}`]);
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
              setEditingLoanDeductionKey(record.key);
              form.setFieldsValue({
                [`loanDeduction-${record.key}`]: record.interest,
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
      title: 'ยอดค้างสุทธิ',
      dataIndex: 'totalOutstandingBalance',
      width: 116,
      render: (_, record: LoanTableRow) => {
        return (
          <span className="text-inactive">
            {(
              Number(record.outstandingDebt ?? 0) +
              Number(record.loan ?? 0) +
              Number(
                record.interest && record.loan
                  ? record.loan * (record.interest / 100)
                  : 0
              ) -
              Number(record.loanDeduction ?? 0)
            ).toLocaleString()}
          </span>
        );
      },
    },
  ];

  const cancel = (record: LoanTableRow) => {
    if (isNewRow(record)) {
      setData(prevData => prevData.filter(item => item.key !== record.key));
    }
    setEditingKey('');
    form.resetFields();
    setSelectedEmployee(null);
  };

  // Local row save after validation
  const saveLoan = async (record: LoanTableRow) => {
    try {
      const values = await form.validateFields([`loan-${record.key}`]);
      const newData = [...data];
      const index = newData.findIndex(item => item.key === record.key);
      if (index > -1) {
        newData[index].loan = values[`loan-${record.key}`];
        setData(newData);
        setEditingLoanKey('');
        form.resetFields([`loan-${record.key}`]);
      }
    } catch (err) {
      console.error('Save Loan failed:', err);
    }
  };

  const saveInterest = async (record: LoanTableRow) => {
    try {
      const values = await form.validateFields([`interest-${record.key}`]);
      const newData = [...data];
      const index = newData.findIndex(item => item.key === record.key);
      if (index > -1) {
        newData[index].interest = values[`interest-${record.key}`];
        setData(newData);
        setEditingInterestKey('');
        form.resetFields([`interest-${record.key}`]);
      }
    } catch (err) {
      console.error('Save Interest failed:', err);
    }
  };

  const saveLoanDeduction = async (record: LoanTableRow) => {
    try {
      const values = await form.validateFields([`loanDeduction-${record.key}`]);
      const newData = [...data];
      const index = newData.findIndex(item => item.key === record.key);
      if (index > -1) {
        newData[index].loanDeduction = values[`loanDeduction-${record.key}`];
        setData(newData);
        setEditingLoanDeductionKey('');
        form.resetFields([`loanDeduction-${record.key}`]);
      }
    } catch (err) {
      console.error('Save Loan Deduction failed:', err);
    }
  };

  const saveNewRow = async (record: LoanTableRow) => {
    try {
      const values = await form.validateFields([
        'employeeId',
        'loan',
        'interest',
        'loanDeduction',
      ]);
      const newData = [...data];
      const index = newData.findIndex(item => item.key === record.key);
      if (index > -1) {
        newData[index] = {
          ...newData[index],
          employeeId: selectedEmployee ? selectedEmployee?.id : '',
          employeeName: selectedEmployee ? selectedEmployee?.name : '',
          loan: values.loan,
          interest: values.interest,
          loanDeduction: values.loanDeduction,
        };
        setData(newData);
        setEditingKey('');
        form.resetFields(['employeeId', 'uniformDisbursement', 'interest']);
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
      setSuccessMessage('บันทึกข้อมูลการกู้ยืมเงินสำเร็จ');
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
    const newRow: LoanTableRow = {
      key: newKey,
      employeeId: '',
      employeeName: '',
      outstandingDebt: 0,
      loan: 0,
      interest: 0,
      loanDeduction: 0,
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
        <Table<LoanTableRow>
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
                  colSpan={8}
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

export default UniformTable;
