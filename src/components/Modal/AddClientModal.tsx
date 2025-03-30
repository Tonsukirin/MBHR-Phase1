'use client';

import { CustomButton } from '@/components/Buttons';
import { CloseOutlined } from '@ant-design/icons';
import {
  Alert,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Upload,
  message,
} from 'antd';
import Image from 'next/image';
import React, { useState } from 'react';
import './style.css';

interface AddClientModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
}

const AddClientModal: React.FC<AddClientModalProps> = ({
  open,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm(); // Create form instance
  const [errorMessage, setErrorMessage] = useState('');

  const handleFormSubmit = (values: any) => {
    onSubmit(values);
    setErrorMessage('');
    form.resetFields();
  };

  const handleModalCancel = () => {
    form.resetFields();
    setErrorMessage(''); // Clear error message on modal close
    onCancel();
  };

  const handleValidationFailed = (errorInfo: any) => {
    console.log('Validation Failed:', errorInfo);
    setErrorMessage('กรุณากรอกข้อมูลในช่องที่จำเป็นให้ครบถ้วน'); // Show global error message
  };

  const handleUpload = (info: any) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} upload failed`);
    }
  };

  return (
    <Modal
      closable={false}
      title={
        <div className="flex justify-between items-center w-full">
          <span className="ml-[20px]">สร้างหน่วยงานใหม่</span>
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
            form="createUnitForm"
            className="px-4 py-3 h-[48px]"
          >
            สร้างหน่วยงานใหม่
          </CustomButton>
        </div>
      }
      className="w-[744px] h-auto relative"
    >
      <Form
        id="createUnitForm"
        form={form}
        layout="vertical"
        onFinish={handleFormSubmit}
        onFinishFailed={handleValidationFailed}
        className="px-[36px] pt-[20px]"
      >
        {/* Unit Name and Type */}
        <div className="flex gap-10">
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

          <div>
            <div className="flex gap-6">
              <Form.Item
                label="รหัสหน่วยงาน"
                name={['client', 'shownClientId']}
                rules={[{ required: true, message: '' }]}
                className="w-[210px]"
              >
                <Input placeholder="55001" />
              </Form.Item>
              <Form.Item
                label="ชื่อหน่วยงาน"
                name={['client', 'name']}
                rules={[{ required: true, message: '' }]}
                className="w-[210px]"
              >
                <Input placeholder="Moral Business Co. Ltd." />
              </Form.Item>
            </div>

            <div className="flex gap-6">
              <Form.Item
                label="ประเภทหน่วยงาน"
                name={['client', 'industry']}
                rules={[{ required: true, message: '' }]}
                className="w-[280px]"
              >
                <Select placeholder="เลือกประเภทหน่วยงาน">
                  <Select.Option value="agriculture">
                    เกษตรและอุตสาหกรรมอาหาร
                  </Select.Option>
                  <Select.Option value="consumer-product">
                    สินค้าอุปโภคบริโภค
                  </Select.Option>
                  <Select.Option value="financial-business">
                    ธุรกิจการเงิน
                  </Select.Option>
                  <Select.Option value="industrial-product">
                    สินค้าอุตสาหกรรม
                  </Select.Option>
                  <Select.Option value="real-estate-and-construction">
                    อสังหาริมทรัพย์และก่อสร้าง
                  </Select.Option>
                  <Select.Option value="resource">ทรัพยากร</Select.Option>
                  <Select.Option value="service">บริการ</Select.Option>
                  <Select.Option value="technology">เทคโนโลยี</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="ทุนจดทะเบียน (บาท)"
                name={['client', 'registeredCapital']}
                rules={[{ required: true, message: '' }]}
                className="w-[140px]"
              >
                <InputNumber
                  placeholder="1,000,000"
                  controls={false}
                  className="w-[140px]"
                />
              </Form.Item>
            </div>
          </div>
        </div>

        {/* Address Section */}
        <h4 className="font-semibold text-16 mb-2 text-[#404040]">
          ที่อยู่ในการส่งเอกสาร
        </h4>
        <div className="flex gap-x-3">
          <Form.Item
            label="บ้านเลขที่"
            name={['address', 'houseNumber']}
            rules={[{ required: true, message: '' }]}
            className="w-[80px]"
          >
            <Input placeholder="501/29" />
          </Form.Item>
          <Form.Item
            label="อาคาร /ตึก"
            name={['address', 'building']}
            className="w-[232px]"
          >
            <Input placeholder="501/29" />
          </Form.Item>
          <Form.Item
            label="ชั้น"
            name={['address', 'floor']}
            className="w-[52px]"
          >
            <Input placeholder="10" />
          </Form.Item>
          <Form.Item
            label="หมู่ที่"
            name={['address', 'moo']}
            className="w-[52px]"
          >
            <Input placeholder="10" />
          </Form.Item>
          <Form.Item
            label="ซอย"
            name={['address', 'alley']}
            className="w-[160px]"
          >
            <Input placeholder="รามคำแหง 112" />
          </Form.Item>
        </div>

        <div className="flex gap-3">
          <Form.Item
            label="ถนน"
            name={['address', 'road']}
            className="w-[140px]"
          >
            <Input placeholder="รามคำแหง" />
          </Form.Item>
          <Form.Item
            label="ตำบล / แขวง"
            name={['address', 'subDistrict']}
            rules={[{ required: true, message: '' }]}
            className="w-[112px]"
          >
            <Input placeholder="ทุ่งสองห้อง" />
          </Form.Item>
          <Form.Item
            label="อำเภอ / เขต"
            name={['address', 'district']}
            rules={[{ required: true, message: '' }]}
            className="w-[112px]"
          >
            <Input placeholder="หนองจอก" />
          </Form.Item>
          <Form.Item
            label="จังหวัด"
            name={['address', 'province']}
            rules={[{ required: true, message: '' }]}
            className="w-[120px]"
          >
            <Input placeholder="กรุงเทพมหานคร" />
          </Form.Item>
          <Form.Item
            label="รหัสไปรษณีย์"
            name={['address', 'postalCode']}
            rules={[{ required: true, message: '' }]}
            className="w-[92px]"
          >
            <Input placeholder="10510" />
          </Form.Item>
        </div>
        <div className="grid grid-cols-2 gap-x-6">
          <Form.Item
            label="ชื่อลูกค้าที่ติดต่อ"
            name={['client', 'contactPerson', 0, 'name']}
            rules={[
              { required: true, message: 'กรุณากรอกชื่อลูกค้าที่ติดต่อ' },
            ]}
          >
            <Input placeholder="คุณตัวแทน ลูกค้า" />
          </Form.Item>
          <Form.Item
            label="เบอร์โทรมือถือ"
            name={['client', 'contactPerson', 0, 'phone']}
            rules={[{ required: true, message: 'กรุณากรอกเบอร์โทร' }]}
          >
            <Input
              placeholder="081-123-1234"
              maxLength={12}
              onChange={e => {
                const input = e.target.value.replace(/\D/g, '');
                let formattedValue = '';
                if (input.length <= 3) {
                  formattedValue = input;
                } else if (input.length <= 6) {
                  formattedValue = `${input.slice(0, 3)}-${input.slice(3)}`;
                } else {
                  formattedValue = `${input.slice(0, 3)}-${input.slice(
                    3,
                    6
                  )}-${input.slice(6, 10)}`;
                }
                e.target.value = formattedValue;
                // Optionally, if you need to update a form value manually:
                form.setFieldValue(
                  ['contactPerson', 0, 'phone'],
                  formattedValue
                );
              }}
            />
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

export default AddClientModal;
