import {
  FileAddOutlined,
  FileTextOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import { Select } from 'antd';

interface InputSearchListProps {
  // right now handle only two cases
  type: 'employee' | 'contract';
  onSelectOption?: (selectedOption: SearchInputType) => void;
  value?: string;
  onChange?: (value: string) => void;
  onCancel?: () => void;
}

export interface SearchInputType {
  id: string;
  name: string;
  label: string;
  value: string;
  salary?: number;
}

export const MockContractOptions: SearchInputType[] = [
  {
    id: '55102-001',
    name: 'Jim Thompson (เซนทรัลเวิลด์)',
    label: '[55102-001] Jim Thompson (เซนทรัลเวิลด์)',
    value: 'Jim1',
  },
  {
    id: '55102-002',
    name: 'Jim Thompson (สยามพารากอน)',
    label: '[55102-002] Jim Thompson (สยามพารากอน)',
    value: 'Jim2',
  },
  {
    id: '55102-003',
    name: 'Jim Thompson (สาขาอะไรดีน้าที่ยาวๆ)',
    label: '[55102-003] Jim Thompson (สาขาอะไรดีน้าที่ยาวๆ)',
    value: 'Jim3',
  },
  {
    id: '55102-004',
    name: 'Jim Thompson (เซนทรัลชิดลม)',
    label: '[55102-004] Jim Thompson (เซนทรัลชิดลม)',
    value: 'Jim4',
  },
];

export const MockEmployeeOptions: SearchInputType[] = [
  {
    id: '1-56001',
    name: 'ยุวดี นามสกุลแจ่มแจ้ง',
    salary: 9500,
    label: '[1-56001] ยุวดี นามสกุลแจ่มแจ้ง',
    value: 'emp1',
  },
  {
    id: '1-56002',
    name: 'รัตนา เทวพรหม',
    salary: 8000,
    label: '[1-56002] รัตนา เทวพรหม',
    value: 'emp2',
  },
  {
    id: '1-56003',
    name: 'รณพีร์ จุฑาเทพ',
    salary: 9000,
    label: '[1-56003] รณพีร์ จุฑาเทพ',
    value: 'emp3',
  },
  {
    id: '1-56006',
    name: 'ขวัญฤทัย  เทวพรหม',
    salary: 7500,
    label: '[1-56006] ขวัญฤทัย  เทวพรหม',
    value: 'emp4',
  },
  {
    id: '1-56007',
    salary: 10500,
    name: 'กรองแก้ว ศรีสยาม',
    label: '[1-56007] กรองแก้ว ศรีสยาม',
    value: 'emp5',
  },
];

const onSearch = (value: string) => {
  console.log('search:', value);
};

const InputSearchList = ({
  type,
  onSelectOption,
  value,
  onChange,
}: InputSearchListProps) => {
  const handleChange = (
    selectedValue: string,
    option: SearchInputType | SearchInputType[]
  ) => {
    if (onChange) {
      onChange(selectedValue);
    }
    const selectedOption = Array.isArray(option) ? option[0] : option;
    if (onSelectOption) {
      onSelectOption(selectedOption);
    }
  };

  return (
    <div>
      <Select
        className="w-full"
        prefix={
          value ? (
            type === 'contract' ? (
              <FileTextOutlined />
            ) : (
              ''
            )
          ) : type === 'contract' ? (
            <FileAddOutlined className="text-disable" />
          ) : (
            <UserAddOutlined className="text-disable" />
          )
        }
        placeholder={
          type === 'contract'
            ? 'ระบุชื่อสัญญา หรือ รหัสสัญญาที่นี่'
            : 'เพิ่มพนักงานที่นี่'
        }
        options={
          type === 'contract' ? MockContractOptions : MockEmployeeOptions
        }
        optionFilterProp="label"
        showSearch
        suffixIcon={false}
        onChange={handleChange}
        onSearch={onSearch}
        value={value}
      />
    </div>
  );
};

export default InputSearchList;
