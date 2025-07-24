import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '@/contexts/app.context';
import { getAccessTokenFromLS } from '@/utils/auth';

type PromptPayload = {
  title: string;
  promptText: string;
  type: string;
  status: string;
};

type PromptItem = {
  promptId: number;
  accountId: string;
  title: string;
  promptText: string;
  type: string;
  status: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string | null;
  createdByName: string;
  createdByEmail: string;
};

const ReportingTool: React.FC = () => {
  // Hàm xóa prompt
  const handleDeletePrompt = async (promptId: number) => {
    if (!window.confirm('Bạn có chắc muốn xóa prompt này?')) return;
    try {
      await axios.delete(`https://educonnectbe-98kw.onrender.com/api/v1/prompts/${promptId}`, {
        headers: {
          Authorization: `Bearer ${getAccessTokenFromLS()}`,
        },
      });
      alert('Xóa prompt thành công!');
      setPrompts(prompts.filter((p) => p.promptId !== promptId));
    } catch {
      alert('Xóa prompt thất bại!');
    }
  };
  const { userInfo } = useContext(AppContext);
  const accountId = userInfo?.id;
  // State cho cập nhật prompt
  const [editPrompt, setEditPrompt] = useState<PromptItem | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editPromptText, setEditPromptText] = useState('');
  const [editType, setEditType] = useState('');
  const [editStatus, setEditStatus] = useState('active');
  const [editLoading, setEditLoading] = useState(false);

  // Hàm mở modal sửa prompt
  const openEditPrompt = (item: PromptItem) => {
    setEditPrompt(item);
    setEditTitle(item.title);
    setEditPromptText(item.promptText);
    setEditType(item.type);
    setEditStatus(item.status);
  };

  // Hàm cập nhật prompt
  const handleUpdatePrompt = async (promptId: number, data: PromptPayload) => {
    setEditLoading(true);
    try {
      await axios.put(
        `https://educonnectbe-98kw.onrender.com/api/v1/prompts/${promptId}`,
        { promptId, ...data },
        {
          headers: {
            Authorization: `Bearer ${getAccessTokenFromLS()}`,
          },
        }
      );
      alert('Cập nhật prompt thành công!');
      setEditPrompt(null);
    } catch {
      alert('Cập nhật prompt thất bại!');
    } finally {
      setEditLoading(false);
    }
  };
  const [title, setTitle] = useState('');
  const [promptText, setPromptText] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('active');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [prompts, setPrompts] = useState<PromptItem[]>([]);
  const [chatBotMessage, setChatBotMessage] = useState<string | null>(null);
  const [chatLoading, setChatLoading] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportContent, setReportContent] = useState<string | null>(null);

  // Fetch prompts khi mount
  useEffect(() => {
    if (!accountId) return;
    const fetchPrompts = async () => {
      try {
        const res = await axios.get(
          `https://educonnectbe-98kw.onrender.com/api/v1/prompts/account/${accountId}?pageIndex=0&pageSize=10&sortBy=CreatedAt&ascending=false`,
          {
            headers: {
              Authorization: `Bearer ${getAccessTokenFromLS()}`,
            },
          }
        );
        setPrompts(res.data.data || []);
      } catch {
        setPrompts([]);
      }
    };
    fetchPrompts();
  }, [accountId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const payload: PromptPayload = { title, promptText, type, status };
      await axios.post('https://educonnectbe-98kw.onrender.com/api/v1/prompts', payload, {
        headers: {
          Authorization: `Bearer ${getAccessTokenFromLS()}`,
        },
      });
      setResult('Tạo prompt thành công!');
    } catch (err: any) {
      setResult('Tạo prompt thất bại!');
    } finally {
      setLoading(false);
      setShowModal(true);
    }
  };

  // Khi nhấn vào nút prompt, gửi promptText lên chat API và hiển thị kết quả
  const handlePromptClick = async (item: PromptItem) => {
    setChatLoading(true);
    setChatBotMessage(null);
    try {
      const res = await axios.post(
        'https://educonnectbe-98kw.onrender.com/api/v1/chats/messages',
        { message: item.promptText },
        {
          headers: {
            Authorization: `Bearer ${getAccessTokenFromLS()}`,
          },
        }
      );
      setChatBotMessage(res.data?.data?.message || 'Không có phản hồi từ bot.');
    } catch {
      setChatBotMessage('Lỗi khi gửi yêu cầu tới bot.');
    } finally {
      setChatLoading(false);
    }
  };

  const handleTestPrompt = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await axios.post(
        'https://educonnectbe-98kw.onrender.com/api/v1/chats/messages',
        { message: promptText },
        {
          headers: {
            Authorization: `Bearer ${getAccessTokenFromLS()}`,
          },
        }
      );
      setTestResult(res.data?.data?.message || 'Không có phản hồi từ bot.');
    } catch {
      setTestResult('Lỗi khi gửi yêu cầu tới bot.');
    } finally {
      setTesting(false);
    }
  };

  const handleSaveReport = async () => {
    // Giả sử API lưu báo cáo là /api/v1/reports
    try {
      await axios.post(
        'https://educonnectbe-98kw.onrender.com/api/v1/reports',
        { content: reportContent, promptText },
        {
          headers: {
            Authorization: `Bearer ${getAccessTokenFromLS()}`,
          },
        }
      );
      setShowReportModal(false);
      setReportContent(null);
      alert('Lưu báo cáo thành công!');
    } catch {
      alert('Lưu báo cáo thất bại!');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setShowForm(false);
    setTitle('');
    setPromptText('');
    setType('');
    setStatus('active');
    setResult(null);
    setChatBotMessage(null);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 font-sans">
      <div className="max-w-3xl mx-auto py-10 px-4">
        <h1 className="text-4xl font-extrabold text-blue-800 mb-8 text-center tracking-tight drop-shadow-lg">
          <span className="inline-block align-middle mr-2">
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" fill="#3b82f6" />
              <path
                d="M12 7v5l4 2"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          Quản lý Prompt & Báo cáo
        </h1>
        {/* Nút mở form tạo prompt đặt ở trên cùng */}
        {!showForm && (
          <button
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-3 rounded-full shadow-lg hover:scale-105 hover:from-blue-600 hover:to-blue-800 transition-all duration-200 mb-8 mx-auto font-semibold text-lg"
            onClick={() => setShowForm(true)}
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" fill="#fff" />
              <path d="M12 8v8M8 12h8" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Tạo Prompt mới
          </button>
        )}

        {/* Hiển thị các prompt dạng card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {prompts.map((item) => (
            <div
              key={item.promptId}
              className="bg-white border border-blue-100 rounded-2xl shadow-xl p-6 flex flex-col gap-4 hover:shadow-2xl transition-all duration-200 relative"
            >
              <div className="flex flex-row items-center mb-2">
                <h2
                  className="font-bold text-xl text-blue-700 break-words overflow-hidden text-ellipsis whitespace-nowrap flex-1 pr-2"
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
              </div>
              <div
                className="text-base text-gray-700 mb-2 whitespace-pre-line break-words"
                title={item.promptText}
              >
                {item.promptText}
              </div>
              <div className="flex gap-3 justify-end mt-2">
                <button
                  className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-full shadow hover:bg-blue-600 hover:scale-105 text-sm font-semibold transition-all"
                  title="Xem kết quả bot"
                  onClick={() => handlePromptClick(item)}
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
                <button
                  className="flex items-center gap-2 bg-yellow-400 text-white px-4 py-2 rounded-full shadow hover:bg-yellow-500 hover:scale-105 text-sm font-semibold transition-all"
                  title="Sửa prompt"
                  onClick={() => openEditPrompt(item)}
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
                  onClick={() => handleDeletePrompt(item.promptId)}
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
          ))}
        </div>

        {/* Hiển thị kết quả chat bot nếu có */}
        {chatBotMessage && (
          <div className="mb-4 p-4 border rounded bg-gray-50 text-gray-800">
            <strong>Bot:</strong> {chatBotMessage}
          </div>
        )}
        {chatLoading && <div className="mb-4 text-blue-600">Đang lấy phản hồi từ bot...</div>}

        {/* Modal sửa prompt riêng */}
        {editPrompt && (
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
        )}

        {/* Modal tạo prompt riêng */}
        {showForm && (
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
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                      onClick={() => {
                        setShowReportModal(true);
                        setReportContent(testResult);
                      }}
                    >
                      Lưu báo cáo
                    </button>
                    <button
                      className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                      onClick={() => setTestResult(null)}
                    >
                      Đóng
                    </button>
                  </div>
                </div>
              )}
              {/* Modal lưu báo cáo */}
              {showReportModal && (
                <div className="fixed left-0 top-0 w-full h-full flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg shadow-lg p-6 min-w-[350px]">
                    <h3 className="text-lg font-semibold mb-2">Lưu báo cáo</h3>
                    <textarea
                      className="w-full border rounded px-3 py-2 mb-2"
                      value={reportContent || ''}
                      onChange={(e) => setReportContent(e.target.value)}
                      rows={5}
                    />
                    <div className="flex gap-2">
                      <button
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        onClick={handleSaveReport}
                      >
                        Lưu báo cáo
                      </button>
                      <button
                        className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                        onClick={() => setShowReportModal(false)}
                      >
                        Đóng
                      </button>
                    </div>
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
        )}
      </div>
    </div>
  );
};

export default ReportingTool;
