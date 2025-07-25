import React, { useState } from 'react';

export interface BotChatCardProps {
  messages: string[];
  onSaveReport: (msg: string) => void;
  onSendChat: (
    chatText: string,
    setLoading: (v: boolean) => void,
    setInput: (v: string) => void
  ) => void;
}

const BotChatCard: React.FC<BotChatCardProps> = ({ messages, onSaveReport, onSendChat }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <div className="p-6 border rounded-2xl bg-white shadow-md flex flex-col gap-5 w-full max-w-2xl mx-auto">
      <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto pr-2 scroll-smooth">
        {messages.map((msg, idx) => {
          const isBot = msg.startsWith('Bot:');
          const isUser = msg.startsWith('Bạn:');
          const isPrompt = idx === 0;

          const cleanedMsg = msg.replace(/^Bot:|^Bạn:/, '').trim();
          const messageLines = cleanedMsg.split('\n');

          const baseBubble =
            'px-4 py-2 rounded-2xl text-sm whitespace-pre-wrap shadow max-w-[75%] break-words';
          let bubbleClass = baseBubble;
          let rowClass = 'flex items-end';
          let avatar = null;
          let bubbleAlign = 'items-end';

          if (isPrompt) {
            bubbleClass +=
              ' bg-gray-100 text-gray-800 font-semibold border border-gray-300 text-center mx-auto';
            rowClass = 'flex justify-center';
          } else if (isBot) {
            bubbleClass += ' bg-blue-100 text-blue-900 border border-blue-300';
            rowClass += ' justify-start';
            avatar = (
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-2">
                🤖
              </div>
            );
            bubbleAlign = 'items-start';
          } else if (isUser) {
            bubbleClass += ' bg-green-200 text-gray-800 border border-green-300';
            rowClass += ' justify-end';
            avatar = (
              <div className="w-8 h-8 bg-gray-500 text-white rounded-full flex items-center justify-center text-sm font-semibold ml-2">
                🧑
              </div>
            );
            bubbleAlign = 'items-end';
          }

          return (
            <div key={idx} className={rowClass}>
              {!isUser && avatar}
              <div className={`flex flex-col gap-1 ${bubbleAlign}`}>
                <div className={bubbleClass}>
                  {messageLines.map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                </div>
                {!isPrompt && (
                  <button
                    className={`text-xs px-2 py-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 transition self-${isUser ? 'end' : 'start'}`}
                    onClick={() => onSaveReport(msg)}
                  >
                    💾 Lưu báo cáo
                  </button>
                )}
              </div>
              {isUser && avatar}
            </div>
          );
        })}
      </div>

      <form
        className="flex gap-3 items-center mt-2"
        onSubmit={(e) => {
          e.preventDefault();
          onSendChat(input, setLoading, setInput);
        }}
      >
        <input
          type="text"
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Nhắn tiếp với AI về phản hồi này..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 font-semibold transition disabled:opacity-50"
          disabled={loading || !input.trim()}
        >
          {loading ? 'Đang gửi...' : 'Gửi'}
        </button>
      </form>
    </div>
  );
};

export default BotChatCard;
