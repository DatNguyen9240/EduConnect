import React from 'react';

interface CreatePromptModalProps {
  showForm: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  title: string;
  setTitle: (v: string) => void;
  promptText: string;
  setPromptText: (v: string) => void;
  type: string;
  setType: (v: string) => void;
  status: string;
  setStatus: (v: string) => void;
  loading: boolean;
  handleTestPrompt: () => void;
  testing: boolean;
  testResult: string | null;
  setTestResult: (v: string | null) => void;
  showModal: boolean;
  result: string | null;
  handleCloseModal: () => void;
}

const CreatePromptModal: React.FC<CreatePromptModalProps> = ({
  showForm,
  handleSubmit,
  title,
  setTitle,
  promptText,
  setPromptText,
  type,
  setType,
  status,
  setStatus,
  loading,
  handleTestPrompt,
  testing,
  testResult,
  setTestResult,
  showModal,
  result,
  handleCloseModal,
}) => {
  if (!showForm) return null;
  return (
    <div className="fixed left-0 top-0 w-full h-full flex items-center justify-center z-50">
      <div className="rounded-lg shadow-lg p-6 min-w-[350px] bg-white">
        <h2 className="text-xl font-bold mb-4 text-left">Tạo Prompt mới</h2>
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Tiêu đề"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            className="w-full border rounded px-3 py-2"
            placeholder="Prompt Text"
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            required
          />
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          />
          <select
            className="w-full border rounded px-3 py-2"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="active">active</option>
            <option value="inactive">inactive</option>
          </select>
          <div className="flex gap-2">
            <button
              type="button"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              onClick={handleTestPrompt}
              disabled={testing || !promptText}
            >
              {testing ? 'Đang kiểm tra...' : 'Test Kết Quả'}
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Đang gửi...' : 'Lưu Prompt'}
            </button>
            <button
              type="button"
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              onClick={handleCloseModal}
            >
              Đóng
            </button>
          </div>
        </form>

        {/* Hiển thị kết quả test */}
        {testResult && (
          <div className="mt-4 p-3 border rounded bg-gray-50 text-gray-800">
            <strong>Kết quả test:</strong> {testResult}
            <div className="mt-2 flex gap-2">
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                onClick={() => setTestResult(null)}
              >
                Đóng
              </button>
            </div>
          </div>
        )}

        {/* Modal kết quả lưu prompt */}
        {showModal && (
          <div className="mt-4 text-left">
            <h3 className="text-lg font-semibold mb-2">Kết quả</h3>
            <p className="mb-4">{result}</p>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={handleCloseModal}
            >
              Đóng
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePromptModal;
