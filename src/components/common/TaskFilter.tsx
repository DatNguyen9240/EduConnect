export default function TaskFilter() {
  return (
    <div className="">
      <h2 className="text-lg font-bold text-blue-600 mb-2">Điểm Số</h2>
      <div className="bg-blue-50 border  rounded-lg p-4 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-[220px]">
          <span className="text-sm">Học Kì</span>
          <select className="border rounded px-2 py-1 flex-1 min-w-[150px]">
            <option>Chọn chủ đề</option>
            <option>Học kì 1</option>
            <option>Học kì 2</option>
          </select>
        </div>
        <div className="flex items-center gap-2 min-w-[120px]">
          <span className="text-sm">Khối:</span>
          <select className="border rounded px-2 py-1 flex-1 min-w-[60px]">
            <option>4</option>
            <option>5</option>
            <option>6</option>
          </select>
        </div>
      </div>
    </div>
  );
}
