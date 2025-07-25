import React from 'react';

export interface DeleteConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  description?: string;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  open,
  onClose,
  onConfirm,
  title = 'Xác nhận xóa',
  description = 'Bạn có chắc chắn muốn xóa?',
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-lg shadow-lg p-6 min-w-[320px]">
        <h2 className="text-lg font-bold mb-2">{title}</h2>
        <p className="mb-4">{description}</p>
        <div className="flex justify-end gap-2">
          <button className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300" onClick={onClose}>
            Hủy
          </button>
          <button
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
            onClick={onConfirm}
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
