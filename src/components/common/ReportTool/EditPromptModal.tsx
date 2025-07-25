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
    <div className="fixed left-0 top-0 w-full h-full flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 min-w-[350px]">
        <h3 className="text-lg font-semibold mb-2">Cập nhật Prompt</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdatePrompt(editPrompt.promptId, {
              title: editTitle,
              promptText: editPromptText,
              type: editType,
              status: editStatus,
            });
          }}
          className="space-y-3"
        >
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Tiêu đề"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            required
          />
          <textarea
            className="w-full border rounded px-3 py-2"
            placeholder="Prompt Text"
            value={editPromptText}
            onChange={(e) => setEditPromptText(e.target.value)}
            required
          />
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Type"
            value={editType}
            onChange={(e) => setEditType(e.target.value)}
            required
          />
          <select
            className="w-full border rounded px-3 py-2"
            value={editStatus}
            onChange={(e) => setEditStatus(e.target.value)}
          >
            <option value="active">active</option>
            <option value="inactive">inactive</option>
          </select>
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              disabled={editLoading}
            >
              {editLoading ? 'Đang lưu...' : 'Lưu cập nhật'}
            </button>
            <button
              type="button"
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
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
