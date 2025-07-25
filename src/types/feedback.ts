export interface Feedback {
  feedbackId: number;
  parentId: string;
  parentName: string;
  content: string;
  dateTime: string;
  createdAt?: string;
  target: string;
  isDeleted: boolean;
}
