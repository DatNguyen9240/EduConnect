import { useState, useEffect } from 'react';
import { useNotification } from '@/hooks/useNotification';
import { Button } from '@/components/common/Button';
import { Bell, BellOff, Settings } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface NotificationSettingsProps {
  className?: string;
}

export default function NotificationSettings({ className = '' }: NotificationSettingsProps) {
  const [open, setOpen] = useState(false);
  const {
    isSupported,
    isPermissionGranted,
    fcmToken,
    registerNotification,
    unregisterNotification,
    isLoading,
  } = useNotification();

  const [localPermissionGranted, setLocalPermissionGranted] = useState(false);

  useEffect(() => {
    setLocalPermissionGranted(isPermissionGranted);
  }, [isPermissionGranted]);

  const handleToggleNotification = async () => {
    if (localPermissionGranted) {
      const success = await unregisterNotification();
      if (success) {
        setLocalPermissionGranted(false);
      }
    } else {
      const success = await registerNotification();
      if (success) {
        setLocalPermissionGranted(true);
      }
    }
  };

  const getStatusText = () => {
    if (!isSupported) {
      return 'Trình duyệt không hỗ trợ thông báo';
    }
    if (localPermissionGranted) {
      return 'Thông báo đã được bật';
    }
    if (Notification.permission === 'denied') {
      return 'Thông báo bị từ chối';
    }
    return 'Thông báo chưa được bật';
  };

  const getStatusColor = () => {
    if (!isSupported) return 'text-gray-500';
    if (localPermissionGranted) return 'text-green-600';
    if (Notification.permission === 'denied') return 'text-red-600';
    return 'text-yellow-600';
  };

  return (
    <>
      {/* Button để mở settings */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(true)}
        className={`flex items-center gap-2 ${className}`}
        title="Cài đặt thông báo"
      >
        <Settings size={16} />
        <span className="hidden sm:inline">Thông báo</span>
      </Button>

      {/* Dialog settings */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md w-full">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bell size={20} />
              Cài đặt thông báo
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Trạng thái hỗ trợ */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium">Hỗ trợ trình duyệt</h4>
                <p className="text-sm text-gray-600">
                  {isSupported
                    ? 'Trình duyệt hỗ trợ thông báo'
                    : 'Trình duyệt không hỗ trợ thông báo'}
                </p>
              </div>
              <div
                className={`w-3 h-3 rounded-full ${isSupported ? 'bg-green-500' : 'bg-red-500'}`}
              />
            </div>

            {/* Trạng thái quyền */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium">Quyền thông báo</h4>
                <p className={`text-sm ${getStatusColor()}`}>{getStatusText()}</p>
              </div>
              <div
                className={`w-3 h-3 rounded-full ${
                  localPermissionGranted
                    ? 'bg-green-500'
                    : Notification.permission === 'denied'
                      ? 'bg-red-500'
                      : 'bg-yellow-500'
                }`}
              />
            </div>

            {/* Token status */}
            {fcmToken && (
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <h4 className="font-medium">FCM Token</h4>
                  <p className="text-sm text-gray-600 font-mono text-xs">
                    {fcmToken.substring(0, 20)}...
                  </p>
                </div>
                <div className="w-3 h-3 rounded-full bg-blue-500" />
              </div>
            )}

            {/* Toggle button */}
            {isSupported && Notification.permission !== 'denied' && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium">Bật thông báo</h4>
                  <p className="text-sm text-gray-600">
                    Nhận thông báo về lịch thi, điểm số và các hoạt động khác
                  </p>
                </div>
                <Button
                  onClick={handleToggleNotification}
                  disabled={isLoading}
                  variant={localPermissionGranted ? 'outline' : 'primary'}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : localPermissionGranted ? (
                    <>
                      <BellOff size={16} />
                      Tắt
                    </>
                  ) : (
                    <>
                      <Bell size={16} />
                      Bật
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Hướng dẫn nếu bị từ chối */}
            {Notification.permission === 'denied' && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-medium text-yellow-800">Cần cấp quyền thông báo</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Để nhận thông báo, bạn cần vào cài đặt trình duyệt và bật quyền thông báo cho
                  trang web này.
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
