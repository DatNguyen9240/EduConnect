import { ChevronsUpDown } from 'lucide-react';

const data = [
  {
    subject: 'Toán',
    oral: 10,
    fifteen: 10,
    period: 10,
    final: 10,
    avg: 8,
    highlight: true,
  },
  {
    subject: 'Ngữ văn',
    oral: 10,
    fifteen: 10,
    period: 10,
    final: 5,
    avg: 9.75,
  },
  { subject: 'Tin học', oral: 10, fifteen: 10, period: 10, final: 10, avg: 9.5 },
  { subject: 'Lịch sử', oral: 10, fifteen: 10, period: 10, final: 5, avg: 9.5 },
  { subject: 'Địa lý', oral: 10, fifteen: 10, period: 10, final: 10, avg: 9.0 },
  { subject: 'Vật lý', oral: 10, fifteen: 10, period: 10, final: 5, avg: 9.0 },
  { subject: 'Hóa học', oral: 10, fifteen: 10, period: 10, final: 10, avg: 8.0 },
  { subject: 'Sinh học', oral: 10, fifteen: 10, period: 10, final: 5, avg: 8.0 },
  { subject: 'Tiếng Anh', oral: 10, fifteen: 10, period: 10, final: 10, avg: 8.0 },
  { subject: 'GDCD', oral: 10, fifteen: 10, period: 10, final: 5, avg: 8.0 },
];

export default function ScoreTable() {
  return (
    <div className="border-2 border-blue-400 rounded-lg overflow-x-auto bg-white">
      <table className="min-w-full text-center">
        <thead>
          <tr className="bg-blue-50 font-bold">
            <th className="py-2 px-2 border-b border-blue-200">Môn</th>
            <th className="py-2 px-2 border-b border-blue-200">
              <div className="flex items-center justify-center gap-1">
                Miệng <ChevronsUpDown className="inline w-4 h-4 text-gray-400" />
              </div>
            </th>
            <th className="py-2 px-2 border-b border-blue-200">
              <div className="flex items-center justify-center gap-1">
                15p <ChevronsUpDown className="inline w-4 h-4 text-gray-400" />
              </div>
            </th>
            <th className="py-2 px-2 border-b border-blue-200">
              <div className="flex items-center justify-center gap-1">
                1 tiết <ChevronsUpDown className="inline w-4 h-4 text-gray-400" />
              </div>
            </th>
            <th className="py-2 px-2 border-b border-blue-200">
              <div className="flex items-center justify-center gap-1">
                Cuối Kì <ChevronsUpDown className="inline w-4 h-4 text-gray-400" />
              </div>
            </th>
            <th className="py-2 px-2 border-b border-blue-200">Điểm TB</th>
            <th className="py-2 px-2 border-b border-blue-200">Ghi chú</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => {
            let rowClass = '';
            if (idx === 0) {
              rowClass = 'bg-white text-blue-700 font-semibold';
            } else {
              rowClass = idx % 2 === 1 ? 'bg-blue-50' : 'bg-white';
            }
            return (
              <tr key={idx} className={rowClass}>
                <td className="py-2 px-2 border-t border-dotted border-blue-200">
                  {row.highlight ? (
                    <a href="#" className="text-blue-700 underline font-semibold">
                      {row.subject}
                    </a>
                  ) : (
                    row.subject
                  )}
                </td>
                <td className="py-2 px-2 border-t border-dotted border-blue-200">{row.oral}</td>
                <td className="py-2 px-2 border-t border-dotted border-blue-200">{row.fifteen}</td>
                <td className="py-2 px-2 border-t border-dotted border-blue-200">{row.period}</td>
                <td className="py-2 px-2 border-t border-dotted border-blue-200">{row.final}</td>
                <td className="py-2 px-2 border-t border-dotted border-blue-200">{row.avg}</td>
                <td className="py-2 px-2 border-t border-dotted border-blue-200">
                  <a href="#" className="text-blue-600 hover:underline">
                    Chi tiết &rarr;
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
