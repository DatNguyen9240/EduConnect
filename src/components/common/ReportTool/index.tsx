import React, { useState, useEffect, useContext } from 'react';
import BotChatCard from './BotChatCard';
import EditPromptModal from './EditPromptModal';
import CreatePromptModal from './CreatePromptModal';
import ReportModal from './ReportModal';
import DeletePromptModal from './DeletePromptModal';
import PromptCard from './PromptCard';
import { AppContext } from '@/contexts/app.context';
import { toast } from 'react-toastify';
import {
  fetchPrompts,
  createPrompt,
  updatePrompt,
  deletePrompt,
  sendPromptToBot,
  saveReport,
} from '@/api/reporttool.api';
import type { PromptPayload, PromptItem } from '@/api/reporttool.api';

const ReportingTool: React.FC = () => {
  // State to track which prompt card is expanded
  const [expandedPromptId, setExpandedPromptId] = useState<number | null>(null);
  // Hàm xóa prompt: mở modal xác nhận xóa
  const handleDeletePrompt = (promptId: number) => {
    setDeletePromptId(promptId);
  };
  const { userInfo } = useContext(AppContext);
  const accountId = userInfo?.userId;
  // State cho cập nhật prompt
  const [editPrompt, setEditPrompt] = useState<PromptItem | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editPromptText, setEditPromptText] = useState('');
  const [editType, setEditType] = useState('');
  const [editStatus, setEditStatus] = useState('active');
  const [editLoading, setEditLoading] = useState(false);
  const [deletePromptId, setDeletePromptId] = useState<number | null>(null);
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
      await updatePrompt(promptId, data);
      toast.success('Cập nhật prompt thành công!');
      setEditPrompt(null);
      // Fetch lại danh sách prompts sau khi cập nhật thành công
      if (accountId) {
        const data = await fetchPrompts(accountId);
        setPrompts(data);
      }
    } catch {
      toast.error('Cập nhật prompt thất bại!');
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
  // Mảng lưu các đoạn hội thoại bot, mỗi đoạn là một mảng messages
  const [chatBotThreads, setChatBotThreads] = useState<string[][]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportContent, setReportContent] = useState<string | null>(null);

  // Fetch prompts khi mount
  useEffect(() => {
    if (!accountId) return;
    const fetchData = async () => {
      try {
        const data = await fetchPrompts(accountId);
        setPrompts(data);
      } catch {
        setPrompts([]);
      }
    };
    fetchData();
  }, [accountId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const payload: PromptPayload = { title, promptText, type, status };
      await createPrompt(payload);
      toast.success('Tạo prompt thành công!');
      // Fetch lại danh sách prompts sau khi tạo mới
      if (accountId) {
        const data = await fetchPrompts(accountId);
        setPrompts(data);
      }
      // Đóng modal tạo prompt và reset form
      setShowForm(false);
      setTitle('');
      setPromptText('');
      setType('');
      setStatus('active');
      setResult(null);
    } catch {
      setResult('Tạo prompt thất bại!');
      toast.error('Tạo prompt thất bại!');
    } finally {
      setLoading(false);
    }
  };

  // Khi nhấn vào nút prompt, gửi promptText lên chat API và hiển thị kết quả
  const handlePromptClick = async (item: PromptItem) => {
    setChatLoading(true);
    try {
      const message = await sendPromptToBot(item.promptText);
      setChatBotThreads((prev) => [...prev, [item.promptText, `Bot: ${message}`]]);
    } catch {
      setChatBotThreads((prev) => [
        ...prev,
        [item.promptText, 'Bot: Lỗi khi gửi yêu cầu tới bot.'],
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleTestPrompt = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const message = await sendPromptToBot(promptText);
      setTestResult(message);
    } catch {
      setTestResult('Lỗi khi gửi yêu cầu tới bot.');
    } finally {
      setTesting(false);
    }
  };

  // Đã dùng modal xác nhận lưu báo cáo ở UI, không cần hàm này nữa
  // const handleSaveReport = async () => {};

  const handleCloseModal = () => {
    setShowModal(false);
    setShowForm(false);
    setTitle('');
    setPromptText('');
    setType('');
    setStatus('active');
    setResult(null);
    // Xoá dòng setChatBotMessage vì không còn dùng state này
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 font-sans">
      <div className="max-w-6xl mx-auto py-10 px-4">
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
        <div className="flex flex-col md:flex-row gap-8">
          {/* Prompt cards on the left */}
          <div className="md:w-1/2 w-full flex flex-col">
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
            <div className="flex flex-col gap-6 mb-8">
              {prompts.map((item) => (
                <PromptCard
                  key={item.promptId}
                  item={item}
                  expanded={expandedPromptId === item.promptId}
                  onExpand={() =>
                    setExpandedPromptId(expandedPromptId === item.promptId ? null : item.promptId)
                  }
                  onTest={() => handlePromptClick(item)}
                  onEdit={() => openEditPrompt(item)}
                  onDelete={() => handleDeletePrompt(item.promptId)}
                  chatLoading={chatLoading}
                />
              ))}
            </div>
          </div>
          {/* Chat area on the right */}
          <div className="md:w-1/2 w-full">
            {/* Nút clear AI chat state */}
            <button
              className="mb-4 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded shadow text-sm font-semibold"
              onClick={() => setChatBotThreads([])}
              disabled={chatBotThreads.length === 0}
            >
              Xóa toàn bộ phản hồi AI
            </button>
            {chatBotThreads.length > 0 && (
              <div
                className="mb-4 flex flex-col gap-6 overflow-y-auto"
                style={{ maxHeight: '70vh' }}
              >
                {chatBotThreads.map((thread, idx) => (
                  <div key={idx} className="flex justify-center">
                    <BotChatCard
                      messages={thread}
                      onSaveReport={(msg) => {
                        setReportContent(msg);
                        setShowReportModal(true);
                      }}
                      onSendChat={async (chatText, setLoading, setInput) => {
                        if (!chatText.trim()) return;
                        setLoading(true);
                        try {
                          const reply = await sendPromptToBot(chatText);
                          setChatBotThreads((prev) => {
                            const newArr = [...prev];
                            newArr[idx] = [...newArr[idx], `Bạn: ${chatText}`, `Bot: ${reply}`];
                            return newArr;
                          });
                          setInput('');
                        } catch {
                          setChatBotThreads((prev) => {
                            const newArr = [...prev];
                            newArr[idx] = [
                              ...newArr[idx],
                              `Bạn: ${chatText}`,
                              'Bot: Lỗi khi gửi yêu cầu tới bot.',
                            ];
                            return newArr;
                          });
                          setInput('');
                        } finally {
                          setLoading(false);
                        }
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
            {chatLoading && <div className="mb-4 text-blue-600">Đang lấy phản hồi từ bot...</div>}
          </div>
        </div>

        <EditPromptModal
          editPrompt={editPrompt}
          editTitle={editTitle}
          editPromptText={editPromptText}
          editType={editType}
          editStatus={editStatus}
          editLoading={editLoading}
          setEditTitle={setEditTitle}
          setEditPromptText={setEditPromptText}
          setEditType={setEditType}
          setEditStatus={setEditStatus}
          setEditPrompt={setEditPrompt}
          handleUpdatePrompt={handleUpdatePrompt}
        />

        <CreatePromptModal
          showForm={showForm}
          handleSubmit={handleSubmit}
          title={title}
          setTitle={setTitle}
          promptText={promptText}
          setPromptText={setPromptText}
          type={type}
          setType={setType}
          status={status}
          setStatus={setStatus}
          loading={loading}
          handleTestPrompt={handleTestPrompt}
          testing={testing}
          testResult={testResult}
          setTestResult={setTestResult}
          showModal={showModal}
          result={result}
          handleCloseModal={handleCloseModal}
        />

        <ReportModal
          showReportModal={showReportModal}
          reportContent={reportContent}
          setReportContent={setReportContent}
          accountId={accountId}
          userInfo={userInfo}
          saveReport={saveReport}
          setShowReportModal={setShowReportModal}
          toast={toast}
        />
        <DeletePromptModal
          deletePromptId={deletePromptId}
          setDeletePromptId={setDeletePromptId}
          deletePrompt={deletePrompt}
          prompts={prompts}
          setPrompts={setPrompts}
          toast={toast}
        />
      </div>
    </div>
  );
};

export default ReportingTool;
