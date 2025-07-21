import { createContext } from 'react';

export interface NotificationPayload {
  notification: {
    title: string;
    body: string;
    image?: string;
  };
  data?: Record<string, string>;
}

export interface NotificationContextInterface {
  hasPermission: boolean;
  isTokenRegistered: boolean;
  lastNotification: NotificationPayload | null;
  registerDeviceToken: () => Promise<boolean>;
  unregisterDeviceToken: () => Promise<boolean>;
  showTestNotification: () => void;
}

const initialNotificationContext: NotificationContextInterface = {
  hasPermission: false,
  isTokenRegistered: false,
  lastNotification: null,
  registerDeviceToken: async () => false,
  unregisterDeviceToken: async () => false,
  showTestNotification: () => {},
};

export const NotificationContext = createContext<NotificationContextInterface>(
  initialNotificationContext
);
