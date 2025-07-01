import type { Parent } from '@/types/student';

export const mockParents: Parent[] = [
  {
    id: 'PH001',
    name: 'Nguyễn Văn Bình',
    phone: '0901234567',
    email: 'nguyenvanbinhph@email.com',
    occupation: 'Kỹ sư',
  },
  {
    id: 'PH002',
    name: 'Trần Văn Cường',
    phone: '0907654321',
    email: 'tranvancuongph@email.com',
    occupation: 'Bác sĩ',
  },
  {
    id: 'PH003',
    name: 'Lê Thị Dung',
    phone: '0912345678',
    email: 'lethidungph@email.com',
    occupation: 'Giáo viên',
  },
  {
    id: 'PH004',
    name: 'Phạm Văn Em',
    phone: '0923456789',
    email: 'phamvanemph@email.com',
    occupation: 'Kinh doanh',
  },
  {
    id: 'PH005',
    name: 'Hoàng Thị Phượng',
    phone: '0934567890',
    email: 'hoangthiphuongph@email.com',
    occupation: 'Kế toán',
  },
  {
    id: 'PH006',
    name: 'Vũ Văn Giang',
    phone: '0945678901',
    email: 'vuvangiangph@email.com',
    occupation: 'Luật sư',
  },
  {
    id: 'PH007',
    name: 'Đỗ Thị Hoa',
    phone: '0956789012',
    email: 'dothihoaph@email.com',
    occupation: 'Y tá',
  },
  {
    id: 'PH008',
    name: 'Bùi Văn Inh',
    phone: '0967890123',
    email: 'buivaninhph@email.com',
    occupation: 'Công nhân',
  },
];

export const getParentById = (parentId: string): Parent | undefined => {
  return mockParents.find((parent) => parent.id === parentId);
};
