'use client';

import {
  CarryOutOutlined,
  DollarCircleOutlined,
  FileTextOutlined,
  ShopOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Card, Spin } from 'antd';
import { useRouter } from 'next/navigation';
import './style.css';
import { getAllClient } from '@/services/Client';
import { useEffect, useState } from 'react';
import { getAllEmployees } from '@/services/Employee';

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [clientAmount, setClientAmount] = useState();
  const [employeeAmount, setEmployeeAmount] = useState();
  const [contractAmount, setContractAmount] = useState();
  const router = useRouter();

  const fetchClientAmount = async () => {
    const response = await getAllClient();
    setClientAmount(response.data.total);
  };

  const fetchEmployeeAmount = async () => {
    const response = await getAllEmployees();
    setEmployeeAmount(response.data.total);
  };

  const fetchContractAmount = async () => {
    console.log('contract amount');
  };

  useEffect(() => {
    fetchClientAmount();
    fetchEmployeeAmount();
  }, [fetchClientAmount, fetchEmployeeAmount]);

  return (
    <div className="flex flex-col justify-between h-full">
      {loading ? (
        <Spin
          tip="Loading..."
          className="flex justify-center items-center flex-1"
        />
      ) : (
        <div className="flex flex-col min-h-[90vh]">
          <Breadcrumb
            items={[
              {
                title: 'หน้าหลัก',
              },
            ]}
          />

          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col gap-12 items-center justify-items-center">
              <div className="flex flex-col gap-8 w-full items-center">
                <div className="flex flex-col items-center justify-items-center gap-1">
                  <span className="font-semibold text-18">
                    ยินดีต้อนรับสู่ระบบ Moral Business HR System
                  </span>
                  <span className="text-inactive text-14">
                    เริ่มต้นด้วยการตั้งค่าระบบ เพื่อการใช้งานที่รวดเร็วและแม่นยำ
                  </span>
                </div>
                <div className="flex gap-6 w-full">
                  <Card className="medium-card w-full">
                    <span className="flex justify-items-center items-center justify-between">
                      <div className="flex gap-4">
                        <ShopOutlined className="text-20" />
                        <span>จำนวนหน่วยงาน</span>
                      </div>
                      <span className="text-[#F9991E] text-20 font-semibold">
                        {clientAmount}
                      </span>
                    </span>
                  </Card>
                  <Card className="medium-card w-full">
                    <span className="flex gap-4 justify-items-center items-center justify-between">
                      <div className="flex gap-4">
                        <UserOutlined className="text-20" />
                        <span>จำนวนพนักงาน</span>
                      </div>
                      <span className="text-[#F9991E] text-20 font-semibold">
                        {employeeAmount}
                      </span>
                    </span>
                  </Card>
                  <Card className="medium-card w-full">
                    <span className="flex justify-items-center items-center justify-between">
                      <div className="flex gap-4">
                        <FileTextOutlined className="text-20" />
                        <span>จำนวนสัญญา</span>
                      </div>
                      {/* API Call */}
                      <span className="text-[#F9991E] text-20 font-semibold">
                        -
                      </span>
                    </span>
                  </Card>
                </div>
                {/* <Search
              placeholder="คุณต้องการจะทำอะไร ค้นหาเมนูที่คุณต้องการจะทำรายการที่นี่"
              size="large"
              enterButton
            /> */}
              </div>

              <div className="flex flex-col gap-8 items-center">
                <div className="flex gap-10">
                  <Card
                    className="bg-[#F0F9FF] border-transparent w-[218px] hover:cursor-pointer"
                    onClick={() => router.push('/dashboard/client-management')}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <ShopOutlined className="text-[#06AEFD] text-[56px]" />
                      <span className="text-[#06AEFD] font-medium">
                        รายชื่อหน่วยงาน
                      </span>
                    </div>
                  </Card>
                  <Card
                    className="bg-[#F0F9FF] border-transparent w-[218px] hover:cursor-pointer"
                    onClick={() =>
                      router.push('/dashboard/employee-management')
                    }
                  >
                    <div className="flex flex-col items-center gap-3">
                      <UserOutlined className="text-[#06AEFD] text-[56px]" />
                      <span className="text-[#06AEFD] font-medium">
                        รายชื่อพนักงาน
                      </span>
                    </div>
                  </Card>
                  <Card
                    className="bg-[#F0F9FF] border-transparent w-[218px] hover:cursor-pointer"
                    onClick={() =>
                      router.push('/dashboard/contract-management')
                    }
                  >
                    <div className="flex flex-col items-center gap-3">
                      <FileTextOutlined className="text-[#06AEFD] text-[56px]" />
                      <span className="text-[#06AEFD] font-medium">
                        รายการสัญญางานจ้าง
                      </span>
                    </div>
                  </Card>
                </div>

                <div className="flex gap-[60px]">
                  <Card
                    className="bg-[#F0F9FF] border-transparent hover:cursor-pointer"
                    onClick={() => router.push('/dashboard/daily-activity')}
                  >
                    <div className="flex items-center gap-3">
                      <CarryOutOutlined className="text-[#06AEFD] text-[32px]" />
                      <span className="text-[#06AEFD] font-medium">
                        บันทึกเข้าการทำงาน
                      </span>
                    </div>
                  </Card>
                  <Card
                    className="bg-[#F0F9FF] border-transparent hover:cursor-pointer"
                    onClick={() => router.push('/dashboard/salary-calculation')}
                  >
                    <div className="flex items-center gap-3">
                      <DollarCircleOutlined className="text-[#06AEFD] text-[32px]" />
                      <span className="text-[#06AEFD] font-medium">
                        ระบบคำนวณเงินเดือน
                      </span>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
