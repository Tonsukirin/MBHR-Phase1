'use client';

import { CustomButton } from '@/components/Buttons';
import { CloseOutlined } from '@ant-design/icons';
import { Alert, Form, Input, Modal } from 'antd';
import React, { useState } from 'react';
import './style.css';

interface CreateContactPersonModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
}

const CreateContactPersonModal: React.FC<CreateContactPersonModalProps> = ({
  open,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm();
  const [errorMessage, setErrorMessage] = useState('');

  const handleFormSubmit = (values: any) => {
    onSubmit(values);
    setErrorMessage('');
    form.resetFields();
  };

  const handleModalCancel = () => {
    setErrorMessage('');
    form.resetFields();
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
          <span className="ml-[20px]">เพิ่มรายการลูกค้าที่ติดต่อ</span>
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
            form="createContactPersonForm"
            className="px-4 py-3 h-[48px]"
          >
            เพิ่มรายการใหม่
          </CustomButton>
        </div>
      }
      className="w-[744px] h-auto relative"
    >
      <Form
        id="createContactPersonForm"
        form={form}
        layout="vertical"
        onFinish={handleFormSubmit}
        onFinishFailed={handleValidationFailed}
        className="px-[40px] pt-[20px]"
      >
        <div className="flex gap-6">
          <Form.Item
            label="ชื่อลูกค้าที่ติดต่อ"
            name="name"
            rules={[{ required: true, message: '' }]}
            className="w-[300px]"
          >
            <Input placeholder="คุณตัวแทน ลูกค้า" />
          </Form.Item>
          <Form.Item label="ชื่อตำแหน่ง" name="detail" className="w-[300px]">
            <Input placeholder="ผู้จัดการฝ่ายการตลาด" />
          </Form.Item>
        </div>
        <div className="flex gap-6">
          <Form.Item
            label="เบอร์โทรมือถือ"
            name="phone"
            rules={[{ required: true, message: '' }]}
            className="0812345678"
          >
            <Input placeholder="ทุ่งสองห้อง" />
          </Form.Item>
          <Form.Item label="LINE ID" name="lineID" className="w-[200px]">
            <Input placeholder="moralbusiness" />
          </Form.Item>
          <Form.Item label="อีเมล" name="email" className="w-[236px]">
            <Input placeholder="moralbusiness@gmail.com" />
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

export default CreateContactPersonModal;
