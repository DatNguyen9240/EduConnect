import { axiosInstance } from '../lib/axios';
import { getAccessTokenFromLS } from '@/utils/auth';

export type PromptPayload = {
  title: string;
  promptText: string;
  type: string;
  status: string;
};

export type PromptItem = {
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

export const fetchPrompts = async (accountId: string) => {
  const res = await axiosInstance.get(
    `/api/v1/prompts/account/${accountId}?pageIndex=0&pageSize=10&sortBy=CreatedAt&ascending=false`,
    {
      headers: {
        Authorization: `Bearer ${getAccessTokenFromLS()}`,
      },
    }
  );
  return res.data.data || [];
};

export const createPrompt = async (payload: PromptPayload) => {
  await axiosInstance.post('/api/v1/prompts', payload, {
    headers: {
      Authorization: `Bearer ${getAccessTokenFromLS()}`,
    },
  });
};

export const updatePrompt = async (promptId: number, data: PromptPayload) => {
  await axiosInstance.put(
    `/api/v1/prompts/${promptId}`,
    { promptId, ...data },
    {
      headers: {
        Authorization: `Bearer ${getAccessTokenFromLS()}`,
      },
    }
  );
};

export const deletePrompt = async (promptId: number) => {
  await axiosInstance.delete(`/api/v1/prompts/${promptId}`, {
    headers: {
      Authorization: `Bearer ${getAccessTokenFromLS()}`,
    },
  });
};

export const sendPromptToBot = async (promptText: string) => {
  const res = await axiosInstance.post(
    '/api/v1/chats/messages',
    { message: promptText },
    {
      headers: {
        Authorization: `Bearer ${getAccessTokenFromLS()}`,
      },
    }
  );
  return res.data?.data?.message || 'Không có phản hồi từ bot.';
};

export const saveReport = async (
  accountId: string,
  reportType: string,
  content: string,
  status: string,
  createdBy: string
) => {
  await axiosInstance.post(
    '/api/Report',
    {
      accountId,
      reportType,
      content,
      status,
      createdBy,
    },
    {
      headers: {
        Authorization: `Bearer ${getAccessTokenFromLS()}`,
      },
    }
  );
};
