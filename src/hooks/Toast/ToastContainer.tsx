import { useToast } from './use-toast';

export function ToastContainer() {
  const { toasts, dismiss } = useToast();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`p-4 rounded-md shadow-lg max-w-sm transition-all duration-300
            ${
              toast.variant === 'destructive'
                ? 'bg-red-50 border border-red-200 text-red-800'
                : toast.variant === 'success'
                  ? 'bg-green-50 border border-green-200 text-green-800'
                  : 'bg-white border border-gray-200 text-gray-800'
            }
          `}
        >
          <div className="flex justify-between items-start">
            <div>
              {toast.title && <h4 className="font-medium">{toast.title}</h4>}
              {toast.description && <p className="text-sm mt-1 opacity-90">{toast.description}</p>}
            </div>
            <button
              onClick={() => dismiss(toast.id)}
              className="ml-2 text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
          {toast.action && <div className="mt-2">{toast.action}</div>}
        </div>
      ))}
    </div>
  );
}
