import { useUserStore } from '@/app/stores/userStore';
import { LogoutOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import Image from 'next/image';

const logout = () => {
  console.log('user logout');
};

const UserDropdown = () => {
  const username = useUserStore(state => state.username);
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex gap-2 items-center">
        <Image
          src={'/img/profile-placeholder.svg'} //placeholder
          alt="profile"
          width={32}
          height={32}
          className="w-8 h-8 rounded-full"
        />
        <span className="text-14">{username}</span>
      </div>
      <Popconfirm
        title="ออกจากระบบ"
        description="คุณแน่ใจหรือไม่ที่จะออกจากระบบ"
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
        onConfirm={() => logout()}
      >
        <LogoutOutlined className="text-14 hover:cursor-pointer" />
      </Popconfirm>
    </div>
  );
};

export default UserDropdown;
