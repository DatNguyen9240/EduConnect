'use client';

import { Badge } from '@/components/common/Badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/common/Table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const recentOrders = [
  {
    id: 'ORD-001',
    customer: 'Nguyễn Văn A',
    product: 'iPhone 15 Pro',
    amount: '29,990,000₫',
    status: 'completed',
    date: '2024-01-15',
  },
  {
    id: 'ORD-002',
    customer: 'Trần Thị B',
    product: 'MacBook Air M2',
    amount: '32,990,000₫',
    status: 'pending',
    date: '2024-01-15',
  },
  {
    id: 'ORD-003',
    customer: 'Lê Văn C',
    product: 'iPad Pro 12.9',
    amount: '26,990,000₫',
    status: 'processing',
    date: '2024-01-14',
  },
  {
    id: 'ORD-004',
    customer: 'Phạm Thị D',
    product: 'Apple Watch Series 9',
    amount: '9,990,000₫',
    status: 'completed',
    date: '2024-01-14',
  },
  {
    id: 'ORD-005',
    customer: 'Hoàng Văn E',
    product: 'AirPods Pro 2',
    amount: '6,490,000₫',
    status: 'cancelled',
    date: '2024-01-13',
  },
];

const statusColors = {
  completed: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  cancelled: 'bg-red-100 text-red-800',
};

const statusLabels = {
  completed: 'Hoàn thành',
  pending: 'Chờ xử lý',
  processing: 'Đang xử lý',
  cancelled: 'Đã hủy',
};

export function RecentOrders() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Đơn hàng gần đây</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã đơn</TableHead>
              <TableHead>Khách hàng</TableHead>
              <TableHead>Sản phẩm</TableHead>
              <TableHead>Số tiền</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.product}</TableCell>
                <TableCell>{order.amount}</TableCell>
                <TableCell>
                  <Badge className={statusColors[order.status as keyof typeof statusColors]}>
                    {statusLabels[order.status as keyof typeof statusLabels]}
                  </Badge>
                </TableCell>
                <TableCell>{order.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
