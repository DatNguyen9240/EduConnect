import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function SoDauBai() {
  const [data, setData] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setData([
        "Bài 1: Giới thiệu về React",
        "Bài 2: Components và Props",
        "Bài 3: State và Lifecycle",
        "Bài 4: Handling Events",
        "Bài 5: Conditional Rendering",
      ]);
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Sổ Đầu Bài</h1>
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
