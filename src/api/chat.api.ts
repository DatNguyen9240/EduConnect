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
  chatWithBot: (message: string) => api.post('/api/v1/chat/messages', { message }),
  fetchChatHistory: () => api.get<ChatHistoryResponse>('/api/v1/chat/messages'),
};
