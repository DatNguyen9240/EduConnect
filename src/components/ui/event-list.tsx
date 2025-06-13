import { MoreVertical } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function EventList() {
  const events = [
    {
      id: 1,
      date: 'Nov 21th, 2020',
      title: 'Movie Night',
      time: '10:00 - 10:00 PM',
      price: '$5.0',
      progress: 75,
      tickets: 23,
    },
    {
      id: 2,
      date: 'Nov 6th, 2020',
      title: 'Color Run',
      time: '10:00 - 10:00 PM',
      price: '$0',
      progress: 50,
      tickets: 17,
    },
    {
      id: 3,
      date: 'Nov 21th, 2020',
      title: 'Hostage Situation',
      time: '10:00 - 10:00 PM',
      price: '$5.0',
      progress: 20,
      tickets: 4,
    },
    {
      id: 4,
      date: 'Nov 21th, 2020',
      title: 'Yard Sale',
      time: '10:00 - 10:00 PM',
      price: '$5.0',
      progress: 60,
      tickets: 13,
    },
  ];

  return (
    <div className="space-y-6">
      <h3 className="font-semibold">Event List</h3>
      <p className="text-xs text-gray-400">Lorem ipsum dolor sit amet</p>

      <div className="space-y-4">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}

function EventCard({ event }: { event: any }) {
  return (
    <div className="bg-[#2a2a4e] rounded-lg p-3">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs text-gray-400">{event.date}</p>
          <h4 className="font-semibold">{event.title}</h4>
        </div>
        <button>
          <MoreVertical className="h-5 w-5 text-gray-400" />
        </button>
      </div>

      <div className="flex items-center gap-2 mt-2">
        <Avatar className="h-4 w-4">
          <AvatarFallback className="text-[8px] bg-gray-700">C</AvatarFallback>
        </Avatar>
        <span className="text-xs text-gray-400">{event.time}</span>
      </div>

      <div className="flex justify-between items-center mt-3">
        <span className="font-semibold">{event.price}</span>
        <span className="text-xs text-gray-400">{event.tickets} ticket left</span>
      </div>

      <div className="mt-2 bg-gray-700 h-1 rounded-full overflow-hidden">
        <div className="h-full bg-[#6c5dd3]" style={{ width: `${event.progress}%` }}></div>
      </div>
    </div>
  );
}
