'use client';

import { CustomButton } from '@/components/Buttons';
import { CloseOutlined } from '@ant-design/icons';
import {
  Alert,
  DatePicker,
  Form,
  Input,
  Modal,
  Popover,
  Radio,
  Select,
} from 'antd';
import th from 'antd/es/date-picker/locale/th_TH';
import { RadioChangeEvent } from 'antd/lib';
import dayjs from 'dayjs';
import dayTh from 'dayjs/locale/th';
import buddhistEra from 'dayjs/plugin/buddhistEra';
import React, { useState } from 'react';
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

interface SalaryAdjustModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
}

const SalaryAdjustModal: React.FC<SalaryAdjustModalProps> = ({
  open,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm();
  const [errorMessage, setErrorMessage] = useState('');
  const [adjustedBy, setAdjustedBy] = useState<'MB' | 'client' | null>(null);
  const [effectiveDate, setEffectiveDate] = useState(dayjs().date(21)); // Default value
  const [hasSelectedMonth, setHasSelectedMonth] = useState(false);
  const [openPicker, setOpenPicker] = useState(false);
  const [selectedYear, setSelectedYear] = useState(effectiveDate.year());

  const months = [
    'มกราคม',
    'กุมภาพันธ์',
    'มีนาคม',
    'เมษายน',
    'พฤษภาคม',
    'มิถุนายน',
    'กรกฎาคม',
    'สิงหาคม',
    'กันยายน',
    'ตุลาคม',
    'พฤศจิกายน',
    'ธันวาคม',
  ];

  //mock startDate, needs contract API first
  const contractStartDate = dayjs().year(2025).month(0);

  const startYear = contractStartDate.year();
  const yearOptions = Array.from({ length: 11 }, (_, i) => startYear + i);

  const monthIndex = effectiveDate.month();

  const handleAdjustedByChange = (e: RadioChangeEvent) => {
    const newAdjustedBy = e.target.value;
    setAdjustedBy(newAdjustedBy);

    const selectedDay = newAdjustedBy === 'MB' ? 21 : 1;
    const selectedDate = effectiveDate.date(selectedDay);

    setEffectiveDate(selectedDate);
    form.setFieldsValue({ effectiveStartDate: selectedDate });
  };

  const handleMonthChange = (month: number) => {
    if (
      selectedYear < contractStartDate.year() ||
      (selectedYear === contractStartDate.year() &&
        month < contractStartDate.month())
    ) {
      return;
    }

    const selectedDay = adjustedBy === 'MB' ? 21 : 1;
    const newDate = dayjs().year(selectedYear).month(month).date(selectedDay);

    setEffectiveDate(newDate);
    setHasSelectedMonth(true);
    form.setFieldsValue({ effectiveStartDate: newDate });
    setOpenPicker(false);
  };

  const handleFormSubmit = (values: any) => {
    onSubmit(values);
    setErrorMessage('');
    form.resetFields();
  };

  const handleModalCancel = () => {
    form.resetFields();
    setErrorMessage('');
    onCancel();
  };

  const handleValidationFailed = (errorInfo: any) => {
    console.log('Validation Failed:', errorInfo);
    setErrorMessage('กรุณากรอกข้อมูลในช่องที่จำเป็นให้ครบถ้วน');
  };

  return (
    <Modal
      closable={false}
      title={
        <div className="flex justify-between items-center w-full">
          <span className="ml-[20px]">ปรับเงินเดือน</span>
          <div className="flex items-center">
            <CloseOutlined
              className="cursor-pointer text-16 text-inactive"
              onClick={onCancel}
            />
          </div>
        </div>
      }
      open={open}
      centered
      onCancel={handleModalCancel}
      footer={
        <div className="flex justify-center">
          <CustomButton
            theme="primary"
            htmlType="submit"
            form="editInfoForm"
            className=" px-[21px] py-[13px] h-[48px]"
          >
            แก้ไขรายการ
          </CustomButton>
        </div>
      }
      className="w-[600px] h-auto relative"
    >
      <Form
        id="editInfoForm"
        form={form}
        layout="vertical"
        onFinish={handleFormSubmit}
        onFinishFailed={handleValidationFailed}
        className="px-[40px] pt-[20px]"
      >
        <Form.Item
          label={<span className="w-[144px]">ปรับเงินเดือนโดย</span>}
          labelAlign="left"
          name="adjustedBy"
          layout="horizontal"
          colon={false}
          className="custom-label-no-colon"
        >
          <Radio.Group
            className="flex items-center gap-4 ml-10 text-nowrap"
            onChange={handleAdjustedByChange}
            value={adjustedBy}
            defaultValue={adjustedBy}
          >
            <Radio value="MB" className="">
              Moral Business (MB)
            </Radio>
            <Radio value="client">หน่วยงาน (ลูกค้า)</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label={<span className="w-[144px]">เริ่มปรับเงินเดือนวันที่</span>}
          labelAlign="left"
          name="effectiveStartDate"
          layout="horizontal"
          colon={false}
          className="custom-label-no-colon w-[440px]"
        >
          <Popover
            overlayClassName="custom-calendar-popover"
            arrow={false}
            open={openPicker}
            onOpenChange={setOpenPicker}
            content={
              <div className="rounded-lg shadow-sm w-[300px] h-[312px]">
                <div className="flex justify-end bg-[#FFF7E6] px-2 py-3 rounded-t-lg h-[48px]">
                  <Select
                    className="w-[74px] h-[24px]"
                    value={selectedYear}
                    onChange={setSelectedYear}
                  >
                    {yearOptions.map(year => (
                      <Select.Option key={year} value={year}>
                        {year + 543}
                      </Select.Option>
                    ))}
                  </Select>
                </div>

                <div className="grid grid-cols-3 gap-x-[6px] gap-y-2 m-2">
                  {months.map((name, index) => {
                    const isDisabled =
                      selectedYear < contractStartDate.year() ||
                      (selectedYear === contractStartDate.year() &&
                        index < contractStartDate.month());

                    const isHighlighted =
                      index === monthIndex &&
                      selectedYear === effectiveDate.year();

                    return (
                      <div
                        key={index}
                        className={`text-center cursor-pointer py-[17px] rounded-md ${
                          isHighlighted ? 'text-[#F9991E]' : 'text-[#404040]'
                        } ${isDisabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                        onClick={() => !isDisabled && handleMonthChange(index)}
                      >
                        {name}
                      </div>
                    );
                  })}
                </div>
              </div>
            }
          >
            <DatePicker
              locale={buddhistLocale}
              className="ml-10 w-full"
              value={hasSelectedMonth ? effectiveDate : undefined}
              format="DD-MM-BBBB"
              open={false}
              placeholder="เลือกวันเริ่มการปรับเงินเดือน"
              onClick={() => setOpenPicker(true)}
            />
          </Popover>
        </Form.Item>
        <Form.Item
          label={<span className="w-[144px]">วันสิ้นสุดสัญญา</span>}
          labelAlign="left"
          name="contractEndDate"
          layout="horizontal"
          colon={false}
          className="custom-label-no-colon w-[440px]"
        >
          <DatePicker
            locale={buddhistLocale}
            className="ml-10 w-full"
            placeholder="เลือกวันสิ้นสุดสัญญา"
            format="DD-MM-BBBB"
          />
        </Form.Item>

        <div className="flex gap-x-10">
          <Form.Item
            label={
              <div>
                ค่าแรงแม่บ้าน{' '}
                <span className="text-[#6B6B6B]">(บาท/เดือน)</span>
              </div>
            }
            name="maidSalary"
          >
            <Input
              className="w-[220px]"
              suffix={<span className="text-disable">฿</span>}
            />
          </Form.Item>
          <Form.Item
            label={
              <div>
                ค่าแรงแม่บ้าน <span className="text-[#6B6B6B]">(บาท/วัน)</span>
              </div>
            }
            name="maidSalary"
          >
            <Input
              className="w-[220px]"
              suffix={<span className="text-disable">฿</span>}
            />
          </Form.Item>
        </div>

        <Form.Item
          label={<span className="w-[120px]">เรทการจ่าย OT</span>}
          labelAlign="left"
          name="OTRate"
          layout="horizontal"
          colon={false}
          className="custom-label-no-colon"
        >
          <Radio.Group className="flex items-center gap-4 ml-10">
            <Radio value="MB">ตาม MB</Radio>
            <Radio value="client">ตามลูกค้า (หน่วยงาน)</Radio>
          </Radio.Group>
        </Form.Item>

        <div className="flex gap-6">
          <Form.Item
            label={
              <div>
                1.5x <span className="text-[#6B6B6B]">(บาท/ชั่วโมง)</span>
              </div>
            }
            name="1.5x"
          >
            <Input suffix={<span className="text-disable">฿</span>} />
          </Form.Item>
          <Form.Item
            label={
              <div>
                2x <span className="text-[#6B6B6B]">(บาท/ชั่วโมง)</span>
              </div>
            }
            name="2x"
          >
            <Input suffix={<span className="text-disable">฿</span>} />
          </Form.Item>
          <Form.Item
            label={
              <div>
                3x <span className="text-[#6B6B6B]">(บาท/ชั่วโมง)</span>
              </div>
            }
            name="3x"
          >
            <Input suffix={<span className="text-disable">฿</span>} />
          </Form.Item>
        </div>
      </Form>

      {errorMessage && (
        <div className="absolute left-0 right-0 bottom-[-48px] w-[50%] justify-self-center">
          <Alert
            message={errorMessage}
            type="error"
            showIcon
            closable
            onClose={() => setErrorMessage('')}
          />
        </div>
      )}
    </Modal>
  );
};

export default SalaryAdjustModal;
