import api from '@/lib/axios';

export interface ChatHistoryResponse {
  success: boolean;
  message: string;
  data: {
    messages: {
      role: string;
      message: string;
      timestamp: string;
    }[];
  };
}

export const chatApi = {
  chatWithBot: (message: string) => api.post('/api/Chat/chat-with-cached-history', { message }),
  fetchChatHistory: () => api.get<ChatHistoryResponse>('/api/Chat/chat-history'),
};
