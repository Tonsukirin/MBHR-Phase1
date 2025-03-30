'use client';

import { CustomButton } from '@/components/Buttons';
import { CloseOutlined } from '@ant-design/icons';
import { Alert, Form, Input, Modal, Popconfirm } from 'antd';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { ClientContactPersonBase } from '../../../backend/Client/contactPerson';
import './style.css';

interface EditContactPersonModalProps {
  open: boolean;
  contactPerson: { index: number; data: ClientContactPersonBase } | null;
  onCancel: () => void;
  onSubmit: (values: ClientContactPersonBase, index: number) => void;
  onDelete: (index: number) => void;
}

const EditContactPersonModal: React.FC<EditContactPersonModalProps> = ({
  open,
  contactPerson,
  onCancel,
  onSubmit,
  onDelete,
}) => {
  const [form] = Form.useForm();
  const [errorMessage, setErrorMessage] = useState('');

  const handleFormSubmit = (values: ClientContactPersonBase) => {
    if (contactPerson) onSubmit(values, contactPerson.index);
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

  const handleDeleteCard = () => {
    if (contactPerson) {
      onDelete(contactPerson.index);
    } else {
      setErrorMessage('ไม่พบข้อมูลที่ต้องการลบ');
    }
  };

  useEffect(() => {
    if (contactPerson) {
      form.setFieldsValue({
        name: contactPerson.data.name,
        phone: contactPerson.data.phone,
        lineID: contactPerson.data.lineID,
        email: contactPerson.data.email,
        detail: contactPerson.data.detail,
      });
    } else {
      form.resetFields();
    }
  }, [contactPerson, form]);

  return (
    <Modal
      closable={false}
      title={
        <div className="flex justify-between items-center w-full">
          <span className="ml-[20px]">แก้ไขรายการลูกค้าที่ติดต่อ</span>
          <div className="flex items-center gap-4">
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
              onConfirm={handleDeleteCard}
            >
              <Image
                src={'/img/delete-icon.svg'}
                alt="delete"
                width={16}
                height={16}
                className="cursor-pointer"
              />
            </Popconfirm>
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
            form="editContactPersonForm"
            className="px-4 py-3 h-[48px]"
          >
            แก้ไขรายการ
          </CustomButton>
        </div>
      }
      className="w-[744px] h-auto relative"
    >
      <Form
        id="editContactPersonForm"
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

export default EditContactPersonModal;
