import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function Calendar() {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const calendarData = [
    [
      { day: 31, month: 'prev' },
      { day: 1 },
      { day: 2, dots: ['#6c5dd3', '#00ba88', '#ff754c'] },
      { day: 3 },
      { day: 4 },
      { day: 5 },
      { day: 6, highlight: true, avatars: [1, 2, 3] },
    ],
    [
      { day: 7 },
      { day: 8 },
      { day: 9 },
      { day: 10, event: { text: 'Franklin, 2+', subtext: '09:00-10' } },
      { day: 11 },
      { day: 12 },
      { day: 13 },
    ],
    [
      { day: 14 },
      { day: 15, avatars: [1, 2, 3] },
      { day: 16 },
      { day: 17 },
      { day: 18, event: { text: 'Franklin, 2+', subtext: '09:00-10' } },
      { day: 19 },
      { day: 20, dots: ['#6c5dd3', '#00ba88', '#ff754c'] },
    ],
    [
      { day: 21 },
      { day: 22 },
      { day: 23 },
      { day: 24, highlight: true, dots: ['#6c5dd3', '#00ba88', '#ff754c'] },
      { day: 25 },
      { day: 26 },
      { day: 27 },
    ],
    [
      { day: 28 },
      { day: 28, event: { text: 'Hawkins', subtext: '09:00-10' } },
      { day: 30 },
      { day: 1, month: 'next', highlight: true, color: '#6c5dd3' },
      { day: 2, month: 'next', highlight: true, color: '#6c5dd3' },
      { day: 3, month: 'next', highlight: true, color: '#6c5dd3' },
      { day: 4, month: 'next', highlight: true, color: '#6c5dd3' },
    ],
  ];

  return (
    <div className="grid grid-cols-7 gap-2">
      {days.map((day) => (
        <div key={day} className="text-center py-2 text-sm text-gray-400">
          {day}
        </div>
      ))}

      {calendarData.flat().map((date, index) => (
        <CalendarCell key={index} {...date} />
      ))}
    </div>
  );
}

function CalendarCell({
  day,
  month,
  dots,
  highlight,
  avatars,
  event,
  color,
}: {
  day: number;
  month?: string;
  dots?: string[];
  highlight?: boolean;
  avatars?: number[];
  event?: { text: string; subtext: string };
  color?: string;
}) {
  const isCurrentMonth = !month;
  const bgColor = highlight ? color || '#ff754c' : '#2a2a4e';

  return (
    <div
      className={`aspect-square rounded-lg p-2 flex flex-col ${highlight ? 'text-white' : 'text-gray-300'}`}
      style={{ backgroundColor: bgColor }}
    >
      <div className="text-sm mb-auto">{day}</div>

      {event && (
        <div className="text-xs bg-[#1e1e38] bg-opacity-30 p-1 rounded">
          <div>{event.text}</div>
          <div className="text-gray-400">{event.subtext}</div>
        </div>
      )}

      {avatars && (
        <div className="flex -space-x-1 mt-auto">
          {avatars.map((_, i) => (
            <Avatar key={i} className="h-5 w-5 border border-[#2a2a4e]">
              <AvatarFallback className="text-[8px]">U{i + 1}</AvatarFallback>
            </Avatar>
          ))}
        </div>
      )}

      {dots && (
        <div className="flex gap-1 justify-center mt-auto">
          {dots.map((color, i) => (
            <div key={i} className="h-2 w-2 rounded-full" style={{ backgroundColor: color }}></div>
          ))}
        </div>
      )}
    </div>
  );
}
