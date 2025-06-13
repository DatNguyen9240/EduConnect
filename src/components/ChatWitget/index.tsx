import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatWidget() {
  const [showChatbox, setShowChatbox] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { from: 'user', text: 'Con tôi hôm nay có đi học không?' },
    { from: 'bot', text: 'Dạ, có. Em Nguyễn Văn A đã đi học đầy đủ hôm nay.' },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const handleSend = () => {
    if (message.trim() === '') return;

    const newUserMessage = { from: 'user', text: message };
    setMessages((prev) => [...prev, newUserMessage]);
    setMessage('');

    // Simulated AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { from: 'user', text: message },
        { from: 'bot', text: 'Cảm ơn bạn đã đặt câu hỏi, chúng tôi sẽ phản hồi sớm.' },
      ]);
    }, 800);
  };

  // Auto scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <>
      <motion.button
        onClick={() => setShowChatbox(!showChatbox)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-xl z-50"
        title="Trợ lý ảo"
        whileHover={{ scale: 1.2, boxShadow: '0px 0px 12px rgba(59,130,246,0.7)' }}
        whileTap={{ rotate: 90 }}
        animate={{
          scale: [1, 1.05, 1],
          transition: { duration: 2, repeat: Infinity, repeatType: 'loop' },
        }}
      >
        💬
      </motion.button>

      <AnimatePresence>
        {showChatbox && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-6 w-80 h-96 bg-white border border-gray-300 rounded-xl shadow-lg flex flex-col overflow-hidden z-50"
          >
            <div className="bg-blue-600 text-white px-4 py-2 font-bold">Trợ lý ảo EduConnect</div>

            <div
              className="flex-1 p-4 overflow-y-auto space-y-2 text-sm"
              style={{ scrollbarWidth: 'thin' }}
            >
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`max-w-[75%] px-3 py-2 rounded-lg shadow-sm ${
                    msg.from === 'user'
                      ? 'ml-auto bg-blue-500 text-white rounded-br-none'
                      : 'mr-auto bg-gray-100 text-gray-800 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-2 border-t flex gap-2">
              <input
                type="text"
                placeholder="Nhập câu hỏi..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring"
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <button
                onClick={handleSend}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Gửi
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
