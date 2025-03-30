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
import React, { useEffect, useState } from 'react';
import {
  ClientsResponse,
  UpdateClientRequest,
} from '../../../backend/Client/client';
import './style.css';

interface EditInfoModalProps {
  open: boolean;
  clientInfo: ClientsResponse | null;
  onCancel: () => void;
  onSubmit: (values: UpdateClientRequest) => void;
}

const EditInfoModal: React.FC<EditInfoModalProps> = ({
  open,
  clientInfo,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm();
  const [errorMessage, setErrorMessage] = useState('');

  const handleUpload = (info: any) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} upload failed`);
    }
  };

  const handleFormSubmit = (values: UpdateClientRequest) => {
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

  useEffect(() => {
    if (clientInfo) {
      form.setFieldsValue({
        client: {
          shownClientId: clientInfo.shownClientId,
          name: clientInfo.name,
          industry: clientInfo.industry,
          registeredCapital: clientInfo.registeredCapital,
        },
        address: {
          houseNumber: clientInfo.address.houseNumber,
          building: clientInfo.address.building,
          floor: clientInfo.address.floor,
          moo: clientInfo.address.moo,
          alley: clientInfo.address.alley,
          street: clientInfo.address.street,
          district: clientInfo.address.district,
          subDistrict: clientInfo.address.subDistrict,
          province: clientInfo.address.province,
          postalCode: clientInfo.address.postalCode,
        },
      });
    } else {
      form.resetFields();
    }
  }, [clientInfo, form]);

  return (
    <Modal
      closable={false}
      title={
        <div className="flex justify-between items-center w-full">
          <span className="ml-[20px]">แก้ไขข้อมูลทั่วไป</span>
          <div className="flex items-center">
            <CloseOutlined
              className="cursor-pointer text-16 text-inactive"
              onClick={() => {
                onCancel();
                form.resetFields();
              }}
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
            className="px-[21px] py-[13px] h-[48px]"
          >
            แก้ไขข้อมูล
          </CustomButton>
        </div>
      }
      className="w-[744px] h-auto relative"
    >
      <Form
        id="editInfoForm"
        form={form}
        layout="vertical"
        onFinish={handleFormSubmit}
        onFinishFailed={handleValidationFailed}
        className="px-[40px] pt-[20px]"
      >
        {/* Unit Name and Type */}
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
          <div>
            <div className="flex gap-6">
              <Form.Item
                label="รหัสหน่วยงาน"
                name={['client', 'shownClientId']}
                rules={[{ required: true, message: '' }]}
                className="w-[210px]"
              >
                <Input />
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
                  <Select.Option value="เกษตรและอุตสาหกรรมอาหาร">
                    เกษตรและอุตสาหกรรมอาหาร
                  </Select.Option>
                  <Select.Option value="สินค้าอุปโภคบริโภค">
                    สินค้าอุปโภคบริโภค
                  </Select.Option>
                  <Select.Option value="ธุรกิจการเงิน">
                    ธุรกิจการเงิน
                  </Select.Option>
                  <Select.Option value="สินค้าอุตสาหกรรม">
                    สินค้าอุตสาหกรรม
                  </Select.Option>
                  <Select.Option value="อสังหาริมทรัพย์และก่อสร้าง">
                    อสังหาริมทรัพย์และก่อสร้าง
                  </Select.Option>
                  <Select.Option value="ทรัพยากร">ทรัพยากร</Select.Option>
                  <Select.Option value="บริการ">บริการ</Select.Option>
                  <Select.Option value="เทคโนโลยี">เทคโนโลยี</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="ทุนจดทะเบียน (บาท)"
                name={['client', 'registeredCapital']}
                rules={[{ required: true, message: '' }]}
                className="w-[140px]"
              >
                <InputNumber
                  placeholder="ทุนจดทะเบียน"
                  controls={false}
                  className="w-[140px]"
                />
              </Form.Item>
            </div>
          </div>
        </div>

        {/* Address Section */}
        <h4 className="font-semibold text-14 mb-2 text-[#404040]">
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
            <Input />
          </Form.Item>
          <Form.Item
            label="ชั้น"
            name={['address', 'floor']}
            className="w-[52px]"
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="หมู่ที่"
            name={['address', 'villageNumber']}
            className="w-[52px]"
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="ซอย"
            name={['address', 'alley']}
            className="w-[160px]"
          >
            <Input />
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

export default EditInfoModal;
