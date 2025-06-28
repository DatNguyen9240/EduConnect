import { columns } from '@/components/common/DataTable/columns';
import type { Payment } from '@/components/common/DataTable/columns';
import { DataTable } from '@/components/common/DataTable/data-table';
import TaskFilterExam from '@/components/TaskFilter/TaskFilterExam';

async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  return [
    {
      subject: 'Toán',
      testType: '15 phút',
      examDate: new Date('9/29/2025'),
      releaseDay: new Date('10/2/2025'),
      status: 'pending',
    },
    {
      subject: 'Toán',
      testType: '15 phút',
      examDate: new Date('9/29/2025'),
      releaseDay: new Date('10/2/2025'),
      status: 'pending',
    },
    {
      subject: 'Toán',
      testType: '15 phút',
      examDate: new Date('9/29/2025'),
      releaseDay: new Date('10/2/2025'),
      status: 'pending',
    },
    {
      subject: 'Toán',
      testType: '15 phút',
      examDate: new Date('9/29/2025'),
      releaseDay: new Date('10/2/2025'),
      status: 'pending',
    },
    {
      subject: 'Toán',
      testType: '15 phút',
      examDate: new Date('9/29/2025'),
      releaseDay: new Date('10/2/2025'),
      status: 'pending',
    },
    {
      subject: 'Toán',
      testType: '15 phút',
      examDate: new Date('9/29/2025'),
      releaseDay: new Date('10/2/2025'),
      status: 'pending',
    },
    {
      subject: 'Toán',
      testType: '15 phút',
      examDate: new Date('9/29/2025'),
      releaseDay: new Date('10/2/2025'),
      status: 'pending',
    },
    {
      subject: 'Toán',
      testType: '15 phút',
      examDate: new Date('9/29/2025'),
      releaseDay: new Date('10/2/2025'),
      status: 'pending',
    },
    {
      subject: 'Toán',
      testType: '15 phút',
      examDate: new Date('9/29/2025'),
      releaseDay: new Date('10/2/2025'),
      status: 'pending',
    },
    {
      subject: 'Toán',
      testType: '15 phút',
      examDate: new Date('9/29/2025'),
      releaseDay: new Date('10/2/2025'),
      status: 'pending',
    },
    {
      subject: 'Toán',
      testType: '15 phút',
      examDate: new Date('9/29/2025'),
      releaseDay: new Date('10/2/2025'),
      status: 'pending',
    },
    {
      subject: 'Toán',
      testType: '15 phút',
      examDate: new Date('9/29/2025'),
      releaseDay: new Date('10/2/2025'),
      status: 'pending',
    },
    {
      subject: 'Toán',
      testType: '15 phút',
      examDate: new Date('9/29/2025'),
      releaseDay: new Date('10/2/2025'),
      status: 'pending',
    },
    {
      subject: 'Toán',
      testType: '15 phút',
      examDate: new Date('9/29/2025'),
      releaseDay: new Date('10/2/2025'),
      status: 'pending',
    },
    // ...
  ];
}

export default async function LichThi() {
  const data = await getData();

  return (
    <div className="container">
      <TaskFilterExam />
      <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}
