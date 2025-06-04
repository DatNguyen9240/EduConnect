import TimeTable, { type ScheduleItem } from "@/components/common/TimeTable";
import React from "react";
const timetableData: ScheduleItem[] = [
  // Monday
  {
    subject: "Toán",
    teacher: "Thầy Minh",
    day: "Thứ 2",
    period: 1,
    room: "A101",
    status: "attended",
    location: "NVH",
    roomNote: "Học tại nhà văn hóa Sinh viên, khu Đại học quốc gia",
    time: "07:00 - 08:30",
  },
  {
    subject: "Văn",
    teacher: "Cô Hoa",
    day: "Thứ 2",
    period: 2,
    room: "B202",
    status: "attended",
    location: "P.202",
    roomNote: "Tòa nhà Cơ bản, khu A",
    time: "08:30 - 10:00",
  },
  {
    subject: "Sinh học",
    teacher: "Cô Lan",
    day: "Thứ 2",
    period: 3,
    room: "C303",
    status: "absent",
    location: "NVH",
    roomNote: "Học tại nhà văn hóa Sinh viên, khu Đại học quốc gia",
    time: "10:00 - 11:30",
  },
  {
    subject: "Hóa học",
    teacher: "Thầy Hồng",
    day: "Thứ 2",
    period: 4,
    room: "D404",
    status: "attended",
    location: "P.204",
    roomNote: "Tòa nhà Cơ bản, khu B",
    time: "11:30 - 13:00",
  },
  {
    subject: "Toán nâng cao",
    teacher: "Thầy Minh",
    day: "Thứ 2",
    period: 5,
    room: "A106",
    status: "notyet",
    location: "P.501",
    roomNote: "Tòa nhà Dịch vụ, tầng 5",
    time: "13:00 - 14:30",
  },
  {
    subject: "Thực hành Toán",
    teacher: "Thầy Tâm",
    day: "Thứ 2",
    period: 6,
    room: "Sân vận động",
    status: "attended",
    location: "KTX",
    roomNote: "Ký túc xá khu A",
    time: "14:30 - 16:00",
  },
  {
    subject: "Ngữ Văn",
    teacher: "Cô Hoa",
    day: "Thứ 2",
    period: 7,
    room: "B204",
    status: "notyet",
    location: "P.202",
    roomNote: "Tòa nhà Cơ bản, khu C",
    time: "16:00 - 17:30",
  },
  {
    subject: "Pháp luật đại cương",
    teacher: "Cô Hường",
    day: "Thứ 2",
    period: 8,
    room: "B204",
    status: "attended",
    location: "P.204",
    roomNote: "Tòa nhà Cơ bản, khu A",
    time: "17:30 - 19:00",
  },

  // Tuesday
  {
    subject: "Lý",
    teacher: "Thầy Thế",
    day: "Thứ 3",
    period: 1,
    room: "C101",
    status: "attended",
    location: "NVH",
    roomNote: "Học tại nhà văn hóa Sinh viên, khu Đại học quốc gia",
    time: "07:00 - 08:30",
  },
  {
    subject: "Hóa",
    teacher: "Cô Mai",
    day: "Thứ 3",
    period: 2,
    room: "B202",
    status: "absent",
    location: "P.204",
    roomNote: "Tòa nhà Cơ bản, khu A",
    time: "08:30 - 10:00",
  },
  {
    subject: "Công nghệ thông tin",
    teacher: "Thầy Vũ",
    day: "Thứ 3",
    period: 3,
    room: "G201",
    status: "notyet",
    location: "NVH",
    roomNote: "Học tại nhà văn hóa Sinh viên, khu ĐHQG",
    time: "10:00 - 11:30",
  },
  {
    subject: "Địa lý",
    teacher: "Cô Thủy",
    day: "Thứ 3",
    period: 4,
    room: "C303",
    status: "attended",
    location: "P.303",
    roomNote: "Tòa nhà học thuật, khu B",
    time: "11:30 - 13:00",
  },
  {
    subject: "GDCD",
    teacher: "Thầy Trường",
    day: "Thứ 3",
    period: 5,
    room: "D404",
    status: "attended",
    location: "P.302",
    roomNote: "Tòa nhà Dịch vụ",
    time: "13:00 - 14:30",
  },

  // Wednesday
  {
    subject: "Ngữ Văn",
    teacher: "Cô Linh",
    day: "Thứ 4",
    period: 1,
    room: "A101",
    status: "attended",
    location: "NVH",
    roomNote: "Học tại nhà văn hóa Sinh viên, khu ĐHQG",
    time: "07:00 - 08:30",
  },
  {
    subject: "Vật lý",
    teacher: "Thầy Hải",
    day: "Thứ 4",
    period: 2,
    room: "C102",
    status: "absent",
    location: "P.101",
    roomNote: "Tòa nhà học thuật, khu A",
    time: "08:30 - 10:00",
  },
  {
    subject: "Sinh học",
    teacher: "Cô Lan",
    day: "Thứ 4",
    period: 3,
    room: "B202",
    status: "notyet",
    location: "P.201",
    roomNote: "Tòa nhà học thuật, khu B",
    time: "10:00 - 11:30",
  },
  {
    subject: "Kỹ thuật lập trình",
    teacher: "Thầy Nam",
    day: "Thứ 5",
    period: 1,
    room: "A103",
    status: "attended",
    location: "NVH",
    roomNote: "Học tại nhà văn hóa Sinh viên, khu Đại học quốc gia",
    time: "07:00 - 08:30",
  },
  {
    subject: "Lý",
    teacher: "Thầy Hải",
    day: "Thứ 5",
    period: 2,
    room: "B104",
    status: "absent",
    location: "P.202",
    roomNote: "Tòa nhà Cơ bản, khu A",
    time: "08:30 - 10:00",
  },
  {
    subject: "Hóa học",
    teacher: "Cô Mai",
    day: "Thứ 5",
    period: 3,
    room: "C305",
    status: "notyet",
    location: "P.303",
    roomNote: "Tòa nhà học thuật, khu B",
    time: "10:00 - 11:30",
  },
  {
    subject: "Kỹ năng mềm",
    teacher: "Cô Hạnh",
    day: "Thứ 5",
    period: 4,
    room: "D406",
    status: "attended",
    location: "P.405",
    roomNote: "Tòa nhà Dịch vụ, tầng 4",
    time: "11:30 - 13:00",
  },
  {
    subject: "Lịch sử Đảng",
    teacher: "Thầy Tùng",
    day: "Thứ 5",
    period: 5,
    room: "E505",
    status: "attended",
    location: "NVH",
    roomNote: "Học tại nhà văn hóa Sinh viên",
    time: "13:00 - 14:30",
  },

  // Friday (Thứ 6)
  {
    subject: "Cơ học",
    teacher: "Thầy Khoa",
    day: "Thứ 6",
    period: 1,
    room: "A104",
    status: "attended",
    location: "NVH",
    roomNote: "Học tại nhà văn hóa Sinh viên, khu Đại học quốc gia",
    time: "07:00 - 08:30",
  },
  {
    subject: "Pháp luật",
    teacher: "Cô Hường",
    day: "Thứ 6",
    period: 2,
    room: "B205",
    status: "absent",
    location: "P.305",
    roomNote: "Tòa nhà Cơ bản, khu B",
    time: "08:30 - 10:00",
  },
  {
    subject: "Thực hành Sinh học",
    teacher: "Cô Lan",
    day: "Thứ 6",
    period: 3,
    room: "C306",
    status: "notyet",
    location: "P.503",
    roomNote: "Tòa nhà học thuật, khu A",
    time: "10:00 - 11:30",
  },
  {
    subject: "Thực tập CN",
    teacher: "Cô Nhung",
    day: "Thứ 6",
    period: 4,
    room: "D507",
    status: "attended",
    location: "Sân",
    roomNote: "Ký túc xá khu A",
    time: "11:30 - 13:00",
  },
  {
    subject: "Chuyên đề Lý",
    teacher: "Thầy Đức",
    day: "Thứ 6",
    period: 5,
    room: "E608",
    status: "attended",
    location: "P.102",
    roomNote: "Tòa nhà học thuật",
    time: "13:00 - 14:30",
  },

  // Saturday (Thứ 7)
  {
    subject: "Kỹ năng giao tiếp",
    teacher: "Cô Mai",
    day: "Thứ 7",
    period: 1,
    room: "A107",
    status: "attended",
    location: "NVH",
    roomNote: "Học tại nhà văn hóa Sinh viên",
    time: "07:00 - 08:30",
  },
  {
    subject: "Địa lý",
    teacher: "Cô Thảo",
    day: "Thứ 7",
    period: 2,
    room: "B208",
    status: "absent",
    location: "P.102",
    roomNote: "Tòa nhà Cơ bản",
    time: "08:30 - 10:00",
  },
  {
    subject: "Văn học",
    teacher: "Cô Hoa",
    day: "Thứ 7",
    period: 3,
    room: "C307",
    status: "notyet",
    location: "P.404",
    roomNote: "Tòa nhà học thuật, khu B",
    time: "10:00 - 11:30",
  },
  {
    subject: "Toán ứng dụng",
    teacher: "Thầy Khoa",
    day: "Thứ 7",
    period: 4,
    room: "D309",
    status: "attended",
    location: "P.305",
    roomNote: "Tòa nhà học thuật, khu A",
    time: "11:30 - 13:00",
  },
  {
    subject: "Đọc hiểu tiếng Anh",
    teacher: "Cô Thanh",
    day: "Thứ 7",
    period: 5,
    room: "E410",
    status: "attended",
    location: "NVH",
    roomNote: "Học tại nhà văn hóa Sinh viên, khu ĐHQG",
    time: "13:00 - 14:30",
  },

  // Sunday (Chủ nhật)
  {
    subject: "Chuyên đề về mạng máy tính",
    teacher: "Thầy Lâm",
    day: "Chủ nhật",
    period: 1,
    room: "A110",
    status: "attended",
    location: "NVH",
    roomNote: "Học tại nhà văn hóa Sinh viên",
    time: "07:00 - 08:30",
  },
  {
    subject: "Văn học cổ điển",
    teacher: "Cô Lan",
    day: "Chủ nhật",
    period: 2,
    room: "B211",
    status: "absent",
    location: "P.101",
    roomNote: "Tòa nhà Cơ bản, khu A",
    time: "08:30 - 10:00",
  },
  {
    subject: "Pháp lý kinh tế",
    teacher: "Cô Thảo",
    day: "Chủ nhật",
    period: 3,
    room: "C312",
    status: "notyet",
    location: "P.103",
    roomNote: "Tòa nhà học thuật, khu B",
    time: "10:00 - 11:30",
  },
  {
    subject: "Tiếng Anh giao tiếp",
    teacher: "Cô Thanh",
    day: "Chủ nhật",
    period: 4,
    room: "D404",
    status: "attended",
    location: "P.102",
    roomNote: "Tòa nhà Cơ bản, khu A",
    time: "11:30 - 13:00",
  },
  {
    subject: "Kỹ năng lãnh đạo",
    teacher: "Thầy Hùng",
    day: "Chủ nhật",
    period: 5,
    room: "E506",
    status: "attended",
    location: "NVH",
    roomNote: "Học tại nhà văn hóa Sinh viên",
    time: "13:00 - 14:30",
  },
];

const ThoiKhoaBieuPage = () => {
  return (
    <div className="p-4 sm:p-6 md:p-10">
      {/* Tiêu đề */}
      <h2 className="text-xl sm:text-2xl font-bold text-center mb-2">
        Activities for TriHQSE170376 (Hoàng Quốc Trí)
      </h2>

      {/* Ghi chú đầu trang */}
      <p className="text-sm text-gray-600 text-center mb-1 italic">
        <strong>Note:</strong> These activities do not include extra-curriculum
        activities, such as club activities ...
      </p>
      <p className="text-sm text-gray-500 text-center mb-2">
        <strong>Chú thích:</strong> Các hoạt động trong bảng dưới không bao gồm
        hoạt động ngoại khóa, ví dụ như hoạt động câu lạc bộ ...
      </p>
      <a
        href="#"
        className="text-sm text-red-600 underline block text-center mb-6"
      >
        Các phòng bắt đầu bằng NVH học tại nhà văn hóa Sinh viên, khu Đại học
        quốc gia
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
          <strong className="text-green-600">(attended)</strong>: TriHQSE170376
          đã tham gia hoạt động này
        </p>
        <p>
          <strong className="text-red-500">(absent)</strong>: TriHQSE170376
          không tham gia hoạt động này
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
        Sinh viên có nhu cầu thực hiện các thủ tục, dịch vụ vui lòng liên hệ
        Trung tâm Dịch vụ Sinh viên tại Phòng 202, điện thoại:{" "}
        <a className="text-blue-600" href="tel:02873005855">
          028.73005855
        </a>
        , email:{" "}
        <a className="text-blue-600" href="mailto:sas.hcm@fe.edu.vn">
          sas.hcm@fe.edu.vn
        </a>
        <br />© Powered by FPT University | CMS | library | books24x7
      </div>
    </div>
  );
};

export default ThoiKhoaBieuPage;
