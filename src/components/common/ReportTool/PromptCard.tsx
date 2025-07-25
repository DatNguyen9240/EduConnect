import React from 'react';
import type { PromptItem } from '@/api/reporttool.api';

interface PromptCardProps {
  item: PromptItem;
  expanded: boolean;
  onExpand: () => void;
  onTest: () => void;
  onEdit: () => void;
  onDelete: () => void;
  chatLoading: boolean;
}

const PromptCard: React.FC<PromptCardProps> = ({
  item,
  expanded,
  onExpand,
  onTest,
  onEdit,
  onDelete,
  chatLoading,
}) => {
  return (
    <div className="bg-white border border-blue-100 rounded-2xl shadow-xl p-4 flex flex-col hover:shadow-2xl transition-all duration-200 relative">
      <div className="flex flex-row items-center w-full">
        <button
          className="flex flex-row items-center w-full text-left focus:outline-none"
          onClick={onExpand}
        >
          <h2
            className="font-bold text-lg text-blue-700 break-words overflow-hidden text-ellipsis whitespace-nowrap flex-1 pr-2"
            style={{ maxWidth: 'calc(100% - 110px)' }}
            title={item.title}
          >
            {item.title}
          </h2>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold shadow flex items-center ml-2 flex-shrink-0 min-w-[90px] justify-center ${item.status === 'active' ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-600'}`}
            style={{ alignSelf: 'center' }}
          >
            {item.status === 'active' ? 'Hoạt động' : 'Ẩn'}
          </span>
          <svg
            className={`ml-2 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
            width="20"
            height="20"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              d="M6 9l6 6 6-6"
              stroke="#3b82f6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-full shadow hover:bg-blue-600 hover:scale-105 text-sm font-semibold transition-all ml-2"
          title="Xem kết quả bot"
          onClick={onTest}
          disabled={chatLoading}
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
            <rect x="4" y="4" width="16" height="16" rx="8" fill="#fff" />
            <path
              d="M12 7v5l4 2"
              stroke="#3b82f6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Test
        </button>
      </div>
      {expanded && (
        <div className="mt-3 flex flex-col gap-2 animate-fade-in">
          <div
            className="text-base text-gray-700 whitespace-pre-line break-words mb-2"
            title={item.promptText}
          >
            {item.promptText}
          </div>
          <div className="flex gap-2 justify-end mt-2">
            <button
              className="flex items-center gap-2 bg-yellow-400 text-white px-4 py-2 rounded-full shadow hover:bg-yellow-500 hover:scale-105 text-sm font-semibold transition-all"
              title="Sửa prompt"
              onClick={onEdit}
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <rect x="4" y="4" width="16" height="16" rx="8" fill="#fff" />
                <path
                  d="M16 8l-8 8M8 8h8v8"
                  stroke="#f59e42"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              Sửa
            </button>
            <button
              className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-full shadow hover:bg-red-600 hover:scale-105 text-sm font-semibold transition-all"
              title="Xóa prompt"
              onClick={onDelete}
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <rect x="4" y="4" width="16" height="16" rx="8" fill="#fff" />
                <path
                  d="M8 8l8 8M8 16l8-8"
                  stroke="#ef4444"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              Xóa
            </button>
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>Tạo bởi: {item.createdByName}</span>
            <span>{item.createdAt?.slice(0, 10)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromptCard;
