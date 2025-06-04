import TimeTable from '@/components/common/TimeTable';
import { timetableData } from '@/data/timetableData';

const ThoiKhoaBieuPage = () => {
  return (
    <div className="p-4 sm:p-6 md:p-10">
      {/* Tiêu đề */}
      <h2 className="text-xl sm:text-2xl font-bold text-center mb-2">
        Activities for TriHQSE170376 (Hoàng Quốc Trí)
      </h2>

      {/* Ghi chú đầu trang */}
      <p className="text-sm text-gray-600 text-center mb-1 italic">
        <strong>Note:</strong> These activities do not include extra-curriculum activities, such as
        club activities ...
      </p>
      <p className="text-sm text-gray-500 text-center mb-2">
        <strong>Chú thích:</strong> Các hoạt động trong bảng dưới không bao gồm hoạt động ngoại
        khóa, ví dụ như hoạt động câu lạc bộ ...
      </p>
      <a href="#" className="text-sm text-red-600 underline block text-center mb-6">
        Các phòng bắt đầu bằng NVH học tại nhà văn hóa Sinh viên, khu Đại học quốc gia
      </a>

      {/* Dropdown chọn năm/tuần */}
      <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <label className="font-medium text-sm">YEAR</label>
          <select className="border px-2 py-1 rounded text-sm">
            <option>2025</option>
            <option>2024</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="font-medium text-sm">WEEK</label>
          <select className="border px-2 py-1 rounded text-sm">
            <option>02/06 To 08/06</option>
            <option>09/06 To 15/06</option>
          </select>
        </div>
      </div>

      {/* TimeTable */}
      <div className="flex justify-center w-full overflow-x-auto">
        <div className="min-w-fit">
          <TimeTable data={timetableData} />
        </div>
      </div>

      {/* Chú thích trạng thái */}
      <div className="mt-6 text-sm text-gray-700 px-4 sm:px-0">
        <p>
          <strong className="text-green-600">(attended)</strong>: TriHQSE170376 đã tham gia hoạt
          động này
        </p>
        <p>
          <strong className="text-red-500">(absent)</strong>: TriHQSE170376 không tham gia hoạt động
          này
        </p>
        <p>
          <strong>(Not yet)</strong>: hoạt động chưa diễn ra
        </p>
        <p>
          <strong>(-)</strong>: không có dữ liệu
        </p>
      </div>

      {/* Footer liên hệ */}
      <div className="mt-10 text-xs text-center text-gray-500 border-t pt-4">
        Sinh viên có nhu cầu thực hiện các thủ tục, dịch vụ vui lòng liên hệ Trung tâm Dịch vụ Sinh
        viên tại Phòng 202, điện thoại:{' '}
        <a className="text-blue-600" href="tel:02873005855">
          028.73005855
        </a>
        , email:{' '}
        <a className="text-blue-600" href="mailto:sas.hcm@fe.edu.vn">
          sas.hcm@fe.edu.vn
        </a>
        <br />© Powered by FPT University | CMS | library | books24x7
      </div>
    </div>
  );
};

export default ThoiKhoaBieuPage;
