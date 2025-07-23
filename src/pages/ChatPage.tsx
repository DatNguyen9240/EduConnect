'use client';

import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Phone, Video, MoreHorizontal, Send } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { chatApi } from '@/api/chat.api';
import type { AxiosResponse } from 'axios';
import type { ChatHistoryResponse } from '@/api/chat.api';

interface ChatItem {
  id: string;
  name: string;
  role: string;
  lastMessage: string;
  timestamp: string;
  avatar: string;
  isActive?: boolean;
}

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
  avatar: string;
}

// Hàm tách phần text markdown trước JSON
function extractContent(text: string): string {
  // Nếu có JSON phía sau, chỉ lấy phần trước dấu { đầu tiên
  const idx = text.indexOf('{');
  if (idx > 0) {
    return text.slice(0, idx).trim();
  }
  return text;
}

export default function ChatPage() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await chatApi.fetchChatHistory();
        console.log('lưu lịch sử: ', res.data.messages);
        const history = res.data?.messages || [];
        if (history.length) {
          setMessages(
            history.map((msg: ChatHistoryResponse['data']['messages'][number], idx: number) => ({
              id: idx + '-' + msg.role,
              sender: msg.role,
              content: extractContent(msg.message), // chỉ lấy Content nếu có
              timestamp: new Date(msg.timestamp).toLocaleTimeString(),
              isOwn: msg.role === 'user',
              avatar: msg.role === 'user' ? '/assets/avatar/default.jpg' : '/assets/avatar/bot.png',
            }))
          );
        }
      } catch (err) {
        console.error('Lỗi lấy lịch sử chat:', err);
      }
    };
    fetchHistory();
  }, []);

  // Hàm gửi message
  const handleSend = async () => {
    if (!message.trim()) return;
    const userMsg: Message = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      sender: 'user',
      content: message,
      timestamp: new Date().toLocaleTimeString(),
      isOwn: true,
      avatar: '/assets/avatar/default.jpg',
    };
    setMessages((prev) => [...prev, userMsg]);
    setMessage('');
    setLoading(true);
    try {
      const res = (await chatApi.chatWithBot(message)) as AxiosResponse<{
        role: string;
        message: string;
      }>;
      if (res.data?.message) {
        console.log('Bot trả lời:', res.data.message);
        const botMsg: Message = {
          id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString() + '-bot',
          sender: 'bot',
          content: extractContent(res.data.message), // chỉ lấy Content nếu có
          timestamp: new Date().toLocaleTimeString(),
          isOwn: false,
          avatar: '/assets/avatar/bot.png',
        };
        setMessages((prev) => {
          const all = [...prev, botMsg];
          //   console.log("All messages after bot:", all);
          return all;
        });
      }
    } catch (err) {
      console.error('API error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Thay đổi thông tin chat bot cho đồng bộ giao diện
  const botName = 'EduConnect Bot';
  const botRole = 'AI Chatbot';
  const botAvatar = '/assets/avatar/bot.png';

  const chats: ChatItem[] = [
    {
      id: 'bot',
      name: botName,
      role: botRole,
      lastMessage: '',
      timestamp: '',
      avatar: botAvatar,
      isActive: true,
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50 border-t border-gray-200">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={botAvatar} />
              <AvatarFallback>Bot</AvatarFallback>
            </Avatar>
            <div className="w-3 h-3 bg-green-500 rounded-full absolute ml-7 mt-7 border-2 border-white"></div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input placeholder="Search..." className="pl-10 bg-gray-50 border-gray-200" />
          </div>
        </div>

        <ScrollArea className="flex-1">
          {/* Chats Section */}
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Chats</h3>
            <div className="space-y-1">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    chat.isActive ? 'bg-indigo-500 text-white' : 'hover:bg-gray-50'
                  }`}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={chat.avatar || '/placeholder.svg'} />
                    <AvatarFallback>
                      {chat.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p
                        className={`text-sm font-medium truncate ${chat.isActive ? 'text-white' : 'text-gray-900'}`}
                      >
                        {chat.name}
                      </p>
                      <span
                        className={`text-xs ${chat.isActive ? 'text-indigo-200' : 'text-gray-500'}`}
                      >
                        {chat.timestamp}
                      </span>
                    </div>
                    <p
                      className={`text-xs truncate ${chat.isActive ? 'text-indigo-200' : 'text-gray-500'}`}
                    >
                      {chat.role}
                    </p>
                    {chat.lastMessage && (
                      <p
                        className={`text-xs truncate mt-1 ${chat.isActive ? 'text-indigo-100' : 'text-gray-600'}`}
                      >
                        {chat.lastMessage}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={botAvatar} />
                <AvatarFallback>Bot</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-sm font-medium text-gray-900">{botName}</h2>
                <p className="text-xs text-gray-500">{botRole}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 flex items-center justify-center"
              >
                <Phone className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 flex items-center justify-center"
              >
                <Video className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 flex items-center justify-center"
              >
                <Search className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 flex items-center justify-center"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4 overflow-y-auto h-full">
          <div className="space-y-4 ">
            {loading && <div className="text-xs text-gray-400">Bot đang trả lời...</div>}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
              >
                {!msg.isOwn && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={msg.avatar || '/placeholder.svg'} />
                    <AvatarFallback>Bot</AvatarFallback>
                  </Avatar>
                )}
                <div className={`max-w-xs lg:max-w-md ${msg.isOwn ? 'order-first' : ''}`}>
                  <div
                    className={`px-4 py-2 rounded-2xl ${
                      msg.isOwn ? 'bg-gray-100 text-gray-900' : 'bg-indigo-500 text-white'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                  {msg.timestamp && (
                    <div
                      className={`flex items-center gap-1 mt-1 ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <span className="text-xs text-gray-500">{msg.timestamp}</span>
                      {msg.isOwn && (
                        <div className="w-4 h-4 text-green-500">
                          <svg viewBox="0 0 16 16" fill="currentColor">
                            <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {msg.isOwn && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={msg.avatar || '/placeholder.svg'} />
                    <AvatarFallback>FR</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 items-center ">
              <Input
                placeholder="Type your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="pr-20 bg-gray-50 border-gray-200"
              />
            </div>
            <div>
              <Button
                className="bg-indigo-500 hover:bg-indigo-600"
                onClick={handleSend}
                disabled={loading}
              >
                <Send className="h-4 w-4 mr-2" />
                Send
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
