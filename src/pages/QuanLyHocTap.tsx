import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function QuanLyHocTap() {
  const [data, setData] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setData([
        "Lớp 10A1 - Toán",
        "Lớp 10A1 - Lý",
        "Lớp 10A1 - Hóa",
        "Lớp 10A2 - Toán",
        "Lớp 10A2 - Lý",
      ]);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Quản Lý Học Tập</h1>
      <div className="space-y-4">
        {loading ? (
          <>
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </>
        ) : (
          data.map((item, index) => (
            <div key={index} className="p-3 bg-white rounded shadow">
              {item}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
