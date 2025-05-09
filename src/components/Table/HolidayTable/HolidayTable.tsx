'use client';

import { CustomButton } from '@/components/Buttons';
import { HolidayTypeTag } from '@/components/Tags';
import {
  EditOutlined,
  PlusOutlined,
  SaveOutlined,
  UndoOutlined,
} from '@ant-design/icons';
import {
  Alert,
  DatePicker,
  Empty,
  Form,
  Input,
  Popconfirm,
  Radio,
  Table,
} from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import buddhistEra from 'dayjs/plugin/buddhistEra';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import '../style.css';

dayjs.extend(buddhistEra);
dayjs.locale('th');

interface RowData {
  key: string;
  holiday: string; //format = ISO format, display as DD/MM/YYYY
  holidayName: string;
  holidayType: 'ตาม MB' | 'ตามลูกค้า';
}

const HolidayTable = () => {
  const [holidayType, setHolidayType] = useState('ตาม MB');
  const [showHoliday, setShowHoliday] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [prevDate, setPrevDate] = useState<string>('');
  const [alert, setAlert] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [tableForm] = Form.useForm();
  const [data, setData] = useState<RowData[]>([
    {
      key: '1',
      holiday: '2024-05-04T00:00:00.000Z',
      holidayName: 'วันฉัตรมงคล',
      holidayType: 'ตาม MB',
    },
    {
      key: '2',
      holiday: '2024-06-05T00:00:00.000Z',
      holidayName: 'วันวิสาขบูชา',
      holidayType: 'ตาม MB',
    },
    {
      key: '3',
      holiday: '2024-08-01T00:00:00.000Z',
      holidayName: 'วันเข้าพรรษา',
      holidayType: 'ตาม MB',
    },
    {
      key: '4',
      holiday: '2024-08-14T00:00:00.000Z',
      holidayName: 'วันอาสาฬหบูชา',
      holidayType: 'ตาม MB',
    },
    {
      key: '5',
      holiday: '2024-10-13T00:00:00.000Z',
      holidayName: 'ชดเชยวันแม่แห่งชาติ',
      holidayType: 'ตาม MB',
    },
    {
      key: '6',
      holiday: '2024-10-23T00:00:00.000Z',
      holidayName: 'วันปิยมหาราช',
      holidayType: 'ตาม MB',
    },
    {
      key: '7',
      holiday: '2024-12-05T00:00:00.000Z',
      holidayName: 'วันพ่อแห่งชาติ',
      holidayType: 'ตาม MB',
    },
    {
      key: '8',
      holiday: '2024-12-11T00:00:00.000Z',
      holidayName: 'ชดเชยวันรัฐธรรมนูญ',
      holidayType: 'ตาม MB',
    },
    {
      key: '9',
      holiday: '2025-01-02T00:00:00.000Z',
      holidayName: 'ชดเชยวันสิ้นปีและวันปีใหม่',
      holidayType: 'ตาม MB',
    },
    {
      key: '10',
      holiday: '2025-03-06T00:00:00.000Z',
      holidayName: 'วันมาฆบูชา',
      holidayType: 'ตาม MB',
    },
    {
      key: '11',
      holiday: '2025-04-06T00:00:00.000Z',
      holidayName: 'วันจักรี',
      holidayType: 'ตาม MB',
    },
    {
      key: '12',
      holiday: '2025-04-13T00:00:00.000Z',
      holidayName: 'วันสงกรานต์',
      holidayType: 'ตาม MB',
    },
    {
      key: '13',
      holiday: '2025-04-14T00:00:00.000Z',
      holidayName: 'วันสงกรานต์',
      holidayType: 'ตาม MB',
    },
    {
      key: '14',
      holiday: '2025-05-01T00:00:00.000Z',
      holidayName: 'วันแรงงานแห่งชาติ',
      holidayType: 'ตาม MB',
    },
  ]);

  const handleAddHolidays = () => {
    setShowHoliday(true);
  };

  const handleSave = () => {
    setHolidayType('ตาม MB');
    try {
      //sucess logic
      //convert to ISO format with no -7 UTC shift
      data.map(row => ({
        ...row,
        holiday: row.holiday
          ? dayjs(row.holiday).format('YYYY-MM-DDT00:00:00.000[Z]')
          : null,
      }));

      setEditingKey('');

      setAlert({
        type: 'success',
        message: 'บันทึกข้อมูลวันหยุดนักขัตฤกษ์สำเร็จ',
      });

      setTimeout(() => {
        setAlert(null);
      }, 3000);
    } catch (error) {
      console.log('error: ', error);
      setAlert({ type: 'error', message: 'เกิดข้อผิดพลาด กรุณาลองอีกครั้ง' });
      setTimeout(() => {
        setAlert(null);
      }, 3000);
    }
  };

  const isEditingTable = (record: RowData) => record.key === editingKey;

  const editTableRow = (record: RowData) => {
    if (editingKey) {
      setData(prevData =>
        prevData.map(item =>
          item.key === editingKey ? { ...item, holiday: prevDate } : item
        )
      );
    }

    const blankRowIndex = data.findIndex(isRowEmpty);
    if (blankRowIndex > -1) {
      setData(data.filter((_, index) => index !== blankRowIndex));
    }
    setPrevDate(record.holiday);
    setEditingKey(record.key);
    tableForm.setFieldsValue({ ...record });
  };

  const cancelEditTableRow = () => {
    if (editingKey) {
      const currentRow = data.find(item => item.key === editingKey);
      if (currentRow) {
        setData(prevData =>
          prevData.map(item =>
            item.key === editingKey ? { ...item, holiday: prevDate } : item
          )
        );
      }

      if (currentRow && isRowEmpty(currentRow)) {
        setData(data.filter(item => item.key !== editingKey));
      }
    }
    setEditingKey(null);
    tableForm.resetFields();
  };

  const saveTableRow = async (key: string) => {
    try {
      const row = (await tableForm.validateFields()) as RowData;
      console.log('row: ', row);
      const newData = [...data];
      const index = newData.findIndex(item => key === item.key);

      if (index > -1) {
        const originalRow = newData[index];
        const updatedRow = {
          ...originalRow,
          ...row,
          holiday: row.holiday
            ? dayjs(row.holiday).format('YYYY-MM-DD[T]00:00:00.000[Z]')
            : originalRow.holiday,
          holidayType:
            originalRow.holidayName !== row.holidayName
              ? 'ตามลูกค้า'
              : originalRow.holidayType,
        };

        newData[index] = updatedRow;
        setData(newData);
        setEditingKey(null);
      }
    } catch (err) {
      console.error('Validation Failed:', err);
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
        holiday: '',
        holidayName: '',
        holidayType: 'ตามลูกค้า',
      },
    ]);
    setEditingKey(newKey);
    tableForm.resetFields();
  };

  const isRowEmpty = (row: RowData): boolean => {
    return !row.holiday && !row.holidayName;
  };

  const now = dayjs();

  const columns = [
    {
      title: 'ลำดับ',
      dataIndex: 'index',
      key: 'index',
      width: 72,
      render: (_: any, __: RowData, index: number) => index + 1,
    },
    {
      title: 'วันหยุด (วัน/เดือน/ปี)',
      dataIndex: 'holiday',
      key: 'holiday',
      width: 160,
      sorter: (a: RowData, b: RowData) => {
        const da = Math.abs(now.diff(dayjs(a.holiday)));
        const db = Math.abs(now.diff(dayjs(b.holiday)));
        return da - db;
      },
      // defaultSortOrder: 'ascend',
      render: (holiday: string) => {
        return holiday ? dayjs(holiday).format('DD/MM/BBBB') : '';
      },
    },
    {
      title: 'รายละเอียดวันหยุดนักขัตฤกษ์',
      dataIndex: 'holidayName',
      key: 'holidayName',
    },
    {
      title: 'ประเภทวันหยุด',
      dataIndex: 'holidayType',
      key: 'holidayType',
      width: 100,
      render: (holidayType: string) => (
        <HolidayTypeTag holidayType={holidayType} />
      ),
    },
    {
      title: '',
      dataIndex: 'action',
      width: 80,
      render: (_: any, record: RowData) => {
        const editable = isEditingTable(record);
        return editable ? (
          <span className="flex gap-4 text-[#A3A3A3]">
            <SaveOutlined
              className="text-20"
              onClick={() => saveTableRow(record.key)}
            />
            <UndoOutlined
              className="text-20 text-[#A3A3A3]"
              onClick={cancelEditTableRow}
            />
          </span>
        ) : holidayType === 'ตามลูกค้า' ? (
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
              onConfirm={() => handleDeleteRow(record.key)}
            >
              <Image
                alt="delete-icon"
                src={'/img/delete-icon.svg'}
                width={20}
                height={20}
                className="cursor-pointer text-20"
              />
            </Popconfirm>
          </span>
        ) : (
          <></>
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
      onCell: (record: RowData) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditingTable(record),
      }),
    };
  });

  // EditableCell Component
  const EditableCell: React.FC<{
    editing: boolean;
    dataIndex: string;
    title: string;
    record: RowData;
    children: React.ReactNode;
  }> = ({
    editing,
    dataIndex,
    title: _title,
    record,
    children,
    ...restProps
  }) => {
    const handleDateChange = (date: dayjs.Dayjs | null) => {
      console.log('Raw Date Object:', date);

      const newDate = date ? date.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]') : '';
      console.log('New ISO Date: ', newDate);

      tableForm.setFieldsValue({ [dataIndex]: newDate });
      setData(prevData =>
        prevData.map(item =>
          item.key === record.key ? { ...item, [dataIndex]: newDate } : item
        )
      );
    };
    return (
      <td {...restProps}>
        {editing && dataIndex !== 'index' && dataIndex !== 'holidayType' ? (
          dataIndex === 'holiday' ? (
            <DatePicker
              value={record.holiday ? dayjs(record.holiday) : null}
              onChange={handleDateChange}
              format="DD/MM/BBBB"
            />
          ) : (
            <Form.Item name={dataIndex} style={{ margin: 0 }}>
              <Input />
            </Form.Item>
          )
        ) : (
          children
        )}
      </td>
    );
  };

  const onFinish = async (values: any) => {
    console.log('Form Values Submitted:', values);
    const formattedData = data.map(row => ({
      ...row,
      holiday: row.holiday ? dayjs(row.holiday).format('YYYY-MM-DD') : null,
    }));
    console.log('Formatted Data:', formattedData);
  };

  useEffect(() => {
    const sortedData = [...data].sort(
      (a, b) => new Date(a.holiday).getTime() - new Date(b.holiday).getTime()
    );
    setData(sortedData);
  }, []); //depency array updates after every table save

  return (
    <div>
      {!showHoliday ? (
        <Table
          showHeader={false}
          bordered
          className="no-empty-image"
          locale={{
            emptyText: (
              <Empty
                image={false}
                description={
                  <div className="flex flex-col gap-2 text-[#6B6B6B] items-center gap-y-6 my-10">
                    <Image
                      src={'/img/mb-empty.svg'}
                      alt="no data"
                      width={144}
                      height={88}
                    />
                    <span>
                      <p>
                        กรุณาสร้างรายการ
                        <span className="text-[#F48625]">
                          {' '}
                          วันหยุดนักขัตฤกษ์{' '}
                        </span>
                        ก่อน
                      </p>
                      <p>ถึงจะดำเนินการสร้างสัญญางานจ้างต่อได้</p>
                    </span>
                    <CustomButton
                      theme="primary"
                      className="w-[145px] h-[46px] justify-center"
                      onClick={handleAddHolidays}
                    >
                      สร้างรายการวันหยุด
                    </CustomButton>
                  </div>
                }
              />
            ),
          }}
        />
      ) : (
        <div>
          <div className="flex gap-10 mb-6">
            <span className="text-14 text-inactive">รูปแบบวันหยุด</span>
            <Radio.Group
              className="flex gap-4"
              value={holidayType}
              onChange={e => setHolidayType(e.target.value)}
            >
              <Radio value="ตาม MB">ตาม MB</Radio>
              <Radio value="ตามลูกค้า">ตามลูกค้า</Radio>
            </Radio.Group>
          </div>
          <Form form={tableForm} component={false} onFinish={onFinish}>
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
              footer={() =>
                holidayType === 'ตามลูกค้า' ? (
                  <div>
                    <div
                      className="flex items-center cursor-pointer text-disable"
                      onClick={handleAdd}
                      style={{
                        marginTop: '0.5px',
                        borderBottom: '1px solid #F5F5F5',
                        paddingBottom: '17.5px',
                        marginLeft: '-16px',
                        marginRight: '-16px',
                        paddingLeft: '16px',
                        paddingRight: '16px',
                      }}
                    >
                      <PlusOutlined className="mr-2" />
                      เพิ่มรายการใหม่ที่นี่
                    </div>
                    <div className="flex w-full pt-[24px] justify-end">
                      <CustomButton
                        theme="primary"
                        htmlType="submit"
                        className="flex w-[104px] h-[46px]"
                        onClick={handleSave}
                      >
                        บันทึก
                      </CustomButton>
                    </div>
                  </div>
                ) : (
                  <></>
                )
              }
            />
          </Form>
          {alert && (
            <div className="fixed bottom-14 left-1/2 transform -translate-x-1/2">
              <Alert
                className="w-[395px]"
                message={alert?.message}
                type={alert?.type}
                showIcon
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HolidayTable;
