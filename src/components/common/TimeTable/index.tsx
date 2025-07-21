import React from 'react';

export interface ScheduleItem {
  subject: string;
  teacher: string;
  day: string;
  period: number;
  room: string;
  status?: 'attended' | 'absent' | 'notyet';
  location?: string;
  roomNote?: string;
  time?: string;
}

interface TimeTableProps {
  data?: ScheduleItem[];
}

const days = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];
const maxSlots = 8;

const slotTimes = [
  '07:00 - 08:30',
  '08:30 - 10:00',
  '10:00 - 11:30',
  '11:30 - 13:00',
  '13:00 - 14:30',
  '14:30 - 16:00',
  '16:00 - 17:30',
  '17:30 - 19:00',
];

const TimeTable: React.FC<TimeTableProps> = ({ data = [] }) => {
  const grid: { [day: string]: ScheduleItem[] } = {};

  // Initialize empty grid for each day
  days.forEach((day) => {
    grid[day] = Array(maxSlots).fill(null);
  });

  // Populate the grid with the timetable data
  data.forEach((item) => {
    if (item && typeof item.period === 'number' && item.period >= 1 && item.period <= maxSlots) {
      // Check if the day exists in our grid
      if (grid[item.day]) {
        grid[item.day][item.period - 1] = item; // Adjusting index to match slots
      }
    }
  });

  return (
    <div className="flex justify-center items-start py-6 px-4">
      <div className="overflow-auto w-full max-w-full border rounded shadow-sm">
        <table className="min-w-[800px] table-fixed border-collapse text-[13px] sm:text-sm text-center">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="border px-2 py-1 w-24 sm:w-28">Tiết / Giờ</th>
              {days.map((day, i) => (
                <th key={i} className="border px-2 py-1 min-w-[130px] text-sm">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: maxSlots }).map((_, slotIndex) => (
              <tr key={slotIndex}>
                <td className="border px-2 py-2 font-medium text-gray-800 align-top bg-gray-50">
                  <div className="text-[13px] font-semibold">Tiết {slotIndex + 1}</div>
                  <div className="text-[11px] text-gray-500">{slotTimes[slotIndex]}</div>
                </td>
                {days.map((day, dayIndex) => {
                  const item = grid[day][slotIndex]; // Get subject for this day and time slot
                  return (
                    <td
                      key={dayIndex}
                      className="border px-2 py-2 align-top text-left text-[12px] sm:text-sm min-w-[130px] cursor-pointer hover:bg-yellow-100 transition-all duration-300"
                    >
                      {item ? (
                        <div className="space-y-1 leading-tight">
                          <div className="flex items-center gap-1">
                            <span className="font-semibold text-blue-700">{item.subject}</span>
                            <span className="bg-yellow-200 text-yellow-800 text-[10px] font-medium px-1.5 py-0.5 rounded">
                              View
                            </span>
                          </div>
                          <div className="text-xs text-gray-700">at {item.location ?? 'NVH'}</div>
                          <div className="text-[10px] text-white bg-blue-700 px-2 py-[1px] rounded-full inline-block">
                            {item.roomNote ?? 'Học tại nhà văn hóa Sinh viên, khu ĐHQG'}
                          </div>

                          {/* Status */}
                          {item.status === 'attended' && (
                            <div className="text-green-600 text-xs font-semibold">(attended)</div>
                          )}
                          {item.status === 'absent' && (
                            <div className="text-red-500 text-xs font-semibold">(absent)</div>
                          )}
                          {item.status === 'notyet' && (
                            <div className="text-orange-500 text-xs font-semibold">(Not yet)</div>
                          )}

                          {/* Time */}
                          {item.time && (
                            <div className="inline-block bg-green-500 text-white text-xs px-2 py-[1px] rounded">
                              ({item.time})
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TimeTable;
