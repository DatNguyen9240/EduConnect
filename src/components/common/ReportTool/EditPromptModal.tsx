import React from 'react';
import type { PromptItem, PromptPayload } from '@/api/reporttool.api';

interface EditPromptModalProps {
  editPrompt: PromptItem | null;
  editTitle: string;
  editPromptText: string;
  editType: string;
  editStatus: string;
  editLoading: boolean;
  setEditTitle: (v: string) => void;
  setEditPromptText: (v: string) => void;
  setEditType: (v: string) => void;
  setEditStatus: (v: string) => void;
  setEditPrompt: (v: PromptItem | null) => void;
  handleUpdatePrompt: (id: number, data: PromptPayload) => void;
}

const EditPromptModal: React.FC<EditPromptModalProps> = ({
  editPrompt,
  editTitle,
  editPromptText,
  editType,
  editStatus,
  editLoading,
  setEditTitle,
  setEditPromptText,
  setEditType,
  setEditStatus,
  setEditPrompt,
  handleUpdatePrompt,
}) => {
  if (!editPrompt) return null;
  return (
    <div className="fixed left-0 top-0 w-full h-full flex items-center justify-center z-50 bg-black bg-opacity-30">
      <div className="bg-white rounded-2xl shadow-2xl p-8 min-w-[350px] max-w-[600px] w-full flex flex-col items-center">
        <div className="flex flex-col items-center mb-4">
          <div className="bg-blue-100 rounded-full p-3 mb-2">
            <svg width="36" height="36" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" fill="#3b82f6" />
              <path d="M12 8v4" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
              <path d="M12 16h.01" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-blue-700 mb-1">Cập nhật Prompt</h3>
          <p className="text-gray-600 text-center text-base">
            Bạn có thể chỉnh sửa thông tin prompt bên dưới và nhấn lưu để cập nhật.
          </p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdatePrompt(editPrompt!.promptId, {
              title: editTitle,
              promptText: editPromptText,
              type: editType,
              status: editStatus,
            });
          }}
          className="space-y-4 w-full"
        >
          <input
            className="w-full border border-blue-200 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            placeholder="Tiêu đề"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            required
          />
          <textarea
            className="w-full border border-blue-200 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            placeholder="Prompt Text"
            value={editPromptText}
            onChange={(e) => setEditPromptText(e.target.value)}
            required
            rows={4}
          />
          <input
            className="w-full border border-blue-200 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            placeholder="Type"
            value={editType}
            onChange={(e) => setEditType(e.target.value)}
            required
          />
          <select
            className="w-full border border-blue-200 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            value={editStatus}
            onChange={(e) => setEditStatus(e.target.value)}
          >
            <option value="active">active</option>
            <option value="inactive">inactive</option>
          </select>
          <div className="flex gap-4 justify-end w-full mt-2">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-lg shadow transition-all duration-150"
              disabled={editLoading}
            >
              {editLoading ? 'Đang lưu...' : 'Lưu cập nhật'}
            </button>
            <button
              type="button"
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold px-6 py-2 rounded-lg shadow transition-all duration-150"
              onClick={() => setEditPrompt(null)}
            >
              Đóng
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPromptModal;
