import React, { useState } from 'react';
import useNotification from '@/hooks/useNotification';
import { Button } from '@/components/common/Button';
import { Bell, BellOff, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

interface NotificationSettingsProps {
  className?: string;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ className = '' }) => {
  const {
    hasPermission,
    isTokenRegistered,
    registerDeviceToken,
    unregisterDeviceToken,
    showTestNotification,
  } = useNotification();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleEnableNotifications = async () => {
    setIsLoading(true);
    try {
      const success = await registerDeviceToken();
      if (success) {
        // Hiển thị thông báo kiểm tra để xác nhận thông báo hoạt động
        showTestNotification();
      }
    } catch (error) {
      console.error('Error enabling notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisableNotifications = async () => {
    setIsLoading(true);
    try {
      await unregisterDeviceToken();
    } catch (error) {
      console.error('Error disabling notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Thông báo
        </h2>
        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 text-xs font-medium rounded-full 
              ${
                hasPermission
                  ? 'bg-green-100 text-green-800 border border-green-300'
                  : 'bg-red-100 text-red-800 border border-red-300'
              }`}
          >
            {hasPermission ? 'Đã cho phép' : 'Chưa cho phép'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Status Card */}
        <div className="mb-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-start gap-3">
            {hasPermission ? (
              <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
            ) : (
              <AlertCircle className="h-6 w-6 text-amber-500 mt-0.5 flex-shrink-0" />
            )}
            <div>
              <h3 className="font-medium text-gray-900">
                {hasPermission ? 'Thông báo đã được kích hoạt' : 'Thông báo chưa được kích hoạt'}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {hasPermission
                  ? 'Trình duyệt của bạn đã cho phép nhận thông báo từ EduConnect. Bạn sẽ nhận được các cập nhật quan trọng về lớp học, bài kiểm tra và các sự kiện khác.'
                  : 'Bạn cần cho phép thông báo để nhận các cập nhật quan trọng về lớp học, bài kiểm tra, và các sự kiện khác.'}
              </p>
            </div>
          </div>
        </div>

        {/* Registration Status */}
        {hasPermission && (
          <div className="mb-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-start gap-3">
              {isTokenRegistered ? (
                <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
              ) : (
                <RefreshCw className="h-6 w-6 text-blue-500 mt-0.5 flex-shrink-0" />
              )}
              <div>
                <h3 className="font-medium text-gray-900">
                  {isTokenRegistered ? 'Thiết bị đã đăng ký' : 'Thiết bị chưa đăng ký'}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {isTokenRegistered
                    ? 'Thiết bị của bạn đã được đăng ký để nhận thông báo từ máy chủ EduConnect.'
                    : 'Thiết bị của bạn chưa được đăng ký với máy chủ. Bạn có thể đăng ký để nhận thông báo từ xa.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          {!hasPermission && (
            <Button
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2"
              onClick={handleEnableNotifications}
            >
              <Bell className="h-4 w-4" />
              {isLoading ? 'Đang xử lý...' : 'Bật thông báo'}
            </Button>
          )}

          {hasPermission && !isTokenRegistered && (
            <Button
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2"
              onClick={handleEnableNotifications}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Đang xử lý...' : 'Đăng ký thiết bị'}
            </Button>
          )}

          {hasPermission && isTokenRegistered && (
            <Button
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2"
              variant="destructive"
              onClick={handleDisableNotifications}
            >
              <BellOff className="h-4 w-4" />
              {isLoading ? 'Đang xử lý...' : 'Tắt thông báo'}
            </Button>
          )}

          {hasPermission && (
            <Button
              className="w-full flex items-center justify-center gap-2"
              variant="outline"
              onClick={showTestNotification}
            >
              <Bell className="h-4 w-4" />
              Gửi thông báo kiểm tra
            </Button>
          )}
        </div>

        {/* Help Text */}
        <div className="mt-6 text-xs text-gray-500 bg-gray-50 p-3 rounded-md border border-gray-200">
          <p className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <span>
              Nếu bạn không nhận được thông báo, hãy kiểm tra cài đặt thông báo trong trình duyệt và
              cho phép EduConnect gửi thông báo.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
