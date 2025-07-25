import React from 'react';
import type { PromptItem } from '@/api/reporttool.api';

interface DeletePromptModalProps {
  deletePromptId: number | null;
  setDeletePromptId: (v: number | null) => void;
  deletePrompt: (id: number) => Promise<unknown>;
  prompts: PromptItem[];
  setPrompts: React.Dispatch<React.SetStateAction<PromptItem[]>>;
  toast: {
    success: (msg: string) => void;
    error: (msg: string) => void;
  };
}

const DeletePromptModal: React.FC<DeletePromptModalProps> = ({
  deletePromptId,
  setDeletePromptId,
  deletePrompt,
  prompts,
  setPrompts,
  toast,
}) => {
  if (deletePromptId === null) return null;
  return (
    <div className="fixed left-0 top-0 w-full h-full flex items-center justify-center z-50 bg-black bg-opacity-30">
      <div className="bg-white rounded-xl shadow-2xl p-8 min-w-[350px] max-w-[90vw]">
        <h3 className="text-xl font-bold mb-4 text-red-700">Xác nhận xóa prompt</h3>
        <div className="mb-4 text-gray-700">Bạn có chắc muốn xóa prompt này không?</div>
        <div className="flex gap-3 justify-end">
          <button
            className="bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700 font-semibold"
            onClick={async () => {
              try {
                await deletePrompt(deletePromptId!);
                toast.success('Xóa prompt thành công!');
                setPrompts(prompts.filter((p) => p.promptId !== deletePromptId));
              } catch {
                toast.error('Xóa prompt thất bại!');
              } finally {
                setDeletePromptId(null);
              }
            }}
          >
            Xác nhận xóa
          </button>
          <button
            className="bg-gray-400 text-white px-5 py-2 rounded hover:bg-gray-500 font-semibold"
            onClick={() => setDeletePromptId(null)}
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePromptModal;
