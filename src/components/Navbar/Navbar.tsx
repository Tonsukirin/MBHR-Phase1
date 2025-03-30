'use client';

import {
  DollarOutlined,
  FileTextOutlined,
  HomeOutlined,
  ShopOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Divider, Menu } from 'antd';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import React, { useMemo } from 'react';
import { UserDropdown } from '../UserDropdown';
import './style.css';

const { SubMenu } = Menu;

const Navbar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const pathToKeyMap: { [key: string]: string } = useMemo(
    () => ({
      '/dashboard': '1',
      '/dashboard/client-management': '2',
      '/dashboard/employee-management': '3',
      '/dashboard/employee-management/employee-creation': '4',
      '/dashboard/contracts': '5',
      '/dashboard/contract-management': '6',
      '/dashboard/daily-activity': '7',
      '/dashboard/salary-management': '8',
      '/dashboard/payroll-extra': '9',
      '/dashboard/salary-calculation': '10',
    }),
    []
  );

  const sortedPaths = useMemo(
    () => Object.keys(pathToKeyMap).sort((a, b) => b.length - a.length),
    [pathToKeyMap]
  );

  const matchedKey = useMemo(() => {
    const match = sortedPaths.find(path => pathname.startsWith(path));
    return match ? pathToKeyMap[match] : '1';
  }, [pathname, sortedPaths, pathToKeyMap]);

  return (
    <div className="relative h-screen w-[256px] min-w-[256px] max-w-[256px] bg-[#F0F9FF] shadow-md pt-[20px] pb-[10px]">
      <div className="flex flex-col flex-1">
        <div className="flex items-center mb-4 px-5">
          <Image
            src={'/img/mb.svg'}
            alt="Moral Business Logo"
            width={80}
            height={80}
            priority
          />
        </div>

        <div className="overflow-y-auto pb-[184px] h-screen">
          <Menu
            mode="inline"
            theme="light"
            inlineIndent={16}
            inlineCollapsed={false}
            openKeys={['sub1', 'sub2', 'sub3', 'sub4']}
            className="border-none bg-transparent"
            selectedKeys={[matchedKey]}
          >
            <Menu.Item
              key="1"
              icon={<HomeOutlined />}
              onClick={() => router.push('/dashboard')}
            >
              หน้าหลัก
            </Menu.Item>

            <SubMenu key="sub1" icon={<ShopOutlined />} title="จัดการหน่วยงาน">
              <Menu.Item
                key="2"
                className="px-10"
                onClick={() => router.push('/dashboard/client-management')}
              >
                รายชื่อหน่วยงาน
              </Menu.Item>
            </SubMenu>

            <SubMenu key="sub2" icon={<UserOutlined />} title="จัดการพนักงาน">
              <Menu.Item
                key="3"
                className="px-10"
                onClick={() => router.push('/dashboard/employee-management')}
              >
                รายชื่อพนักงาน
              </Menu.Item>
              <Menu.Item
                key="4"
                className="px-10"
                onClick={() =>
                  router.push(
                    '/dashboard/employee-management/employee-creation'
                  )
                }
              >
                เพิ่มพนักงานใหม่
              </Menu.Item>
            </SubMenu>

            <SubMenu
              key="sub3"
              icon={<FileTextOutlined />}
              title="จัดการสัญญางานจ้าง"
            >
              <Menu.Item
                key="6"
                className="px-10"
                onClick={() => router.push('/dashboard/contract-management')}
              >
                รายการสัญญางานจ้าง
              </Menu.Item>
            </SubMenu>

            <Menu.Item
              key="7"
              icon={<FileTextOutlined />}
              onClick={() => router.push('/dashboard/daily-activity')}
            >
              บันทึกการเข้าทำงาน
            </Menu.Item>

            <SubMenu
              key="sub4"
              icon={<DollarOutlined />}
              title="จัดการเงินเดือน"
            >
              <Menu.Item
                key="8"
                className="px-10"
                onClick={() => router.push('/dashboard/salary-management')}
              >
                ระบบหักเงินพนักงาน
              </Menu.Item>
              <Menu.Item
                key="9"
                className="px-10"
                onClick={() => router.push('/dashboard/payroll-extra')}
              >
                ระบบเพิ่มเงินพิเศษ
              </Menu.Item>
              <Menu.Item
                key="10"
                className="px-10"
                onClick={() => router.push('/dashboard/salary-calculation')}
              >
                ระบบคำนวณเงินเดือน
              </Menu.Item>
            </SubMenu>
          </Menu>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-[#F0F9FF]">
        <Divider className="logout-divider" />
        <div className="px-4 pb-6">
          <UserDropdown />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
