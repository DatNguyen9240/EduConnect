export interface Notification {
  id: string;
  title: string;
  body: string;
  type: 'exam' | 'class' | 'system' | 'grade';
  read: boolean;
  timestamp: string;
  data?: Record<string, string>;
}
