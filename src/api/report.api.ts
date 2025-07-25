import { axiosInstance } from '../lib/axios';

export interface ReportItem {
  reportId: number;
  accountId: string;
  reportType: string;
  content: string;
  status: string;
  isDelete: boolean;
  createdBy: string;
  createdDate: string;
}

export interface GetReportsParams {
  AccountId?: string;
  ReportType?: string;
  Status?: string;
  SortBy?: string;
  SortDesc?: boolean;
  Page?: number;
  PageSize?: number;
  Search?: string;
}

export async function getReports(params: GetReportsParams): Promise<ReportItem[]> {
  const searchParams = new URLSearchParams({
    AccountId: params.AccountId || '',
  });
  const res = await axiosInstance.get(`/api/Report?${searchParams}`);
  if (res.status !== 200) throw new Error('Lỗi khi lấy báo cáo');
  return res.data.items || [];
}

export async function updateReport(data: Partial<ReportItem>) {
  const res = await axiosInstance.put(`/api/Report`, data);
  if (res.status !== 200) throw new Error('Lỗi khi cập nhật báo cáo');
  return res.data;
}

export async function deleteReport(reportId: number | string) {
  const res = await axiosInstance.delete(`/api/Report/${reportId}`);
  if (res.status !== 200) throw new Error('Lỗi khi xóa báo cáo');
  return res.data;
}
