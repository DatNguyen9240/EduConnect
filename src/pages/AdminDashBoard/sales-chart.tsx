'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function SalesChart() {
  // Dữ liệu mẫu cho biểu đồ
  const salesData = [
    { month: 'T1', sales: 4000 },
    { month: 'T2', sales: 3000 },
    { month: 'T3', sales: 5000 },
    { month: 'T4', sales: 4500 },
    { month: 'T5', sales: 6000 },
    { month: 'T6', sales: 5500 },
    { month: 'T7', sales: 7000 },
    { month: 'T8', sales: 6500 },
    { month: 'T9', sales: 8000 },
    { month: 'T10', sales: 7500 },
    { month: 'T11', sales: 9000 },
    { month: 'T12', sales: 8500 },
  ];

  const maxSales = Math.max(...salesData.map((d) => d.sales));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Biểu đồ doanh thu theo tháng</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <div className="flex h-full items-end justify-between gap-2">
            {salesData.map((data, index) => (
              <div key={index} className="flex flex-col items-center gap-2 flex-1">
                <div
                  className="w-full bg-blue-500 rounded-t-sm transition-all hover:bg-blue-600"
                  style={{
                    height: `${(data.sales / maxSales) * 100}%`,
                    minHeight: '20px',
                  }}
                  title={`${data.month}: ${data.sales.toLocaleString()}₫`}
                />
                <span className="text-xs text-muted-foreground">{data.month}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
