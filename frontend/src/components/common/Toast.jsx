// ============================================================================
// Toast Component - CloudPOS
// ============================================================================
import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { alertColors } from '../../config/colors';

// ── Toast Context ───────────────────────────────────────────────────────────
const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// ── Toast Provider ──────────────────────────────────────────────────────────
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { ...toast, id }]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const toast = {
    success: (message, options = {}) =>
      addToast({ type: 'success', message, ...options }),
    error: (message, options = {}) =>
      addToast({ type: 'error', message, ...options }),
    warning: (message, options = {}) =>
      addToast({ type: 'warning', message, ...options }),
    info: (message, options = {}) =>
      addToast({ type: 'info', message, ...options }),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

// ── Toast Container ─────────────────────────────────────────────────────────
const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
};

// ── Toast Item ──────────────────────────────────────────────────────────────
const ToastItem = ({ toast, onClose }) => {
  const { type = 'info', message, title, duration = 5000 } = toast;

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const icons = {
    success: CheckCircle,
    error:   AlertCircle,
    warning: AlertTriangle,
    info:    Info,
  };

  const Icon = icons[type];
  const colors = alertColors[type] || alertColors.info;

  return (
    <div
      className={`
        pointer-events-auto
        flex items-start gap-3
        w-full p-4 rounded-xl shadow-lg
        ${colors.bg} ${colors.text}
        border-l-4 ${colors.border}
        animate-in slide-in-from-right fade-in duration-300
      `}
    >
      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${colors.icon}`} />
      <div className="flex-1 min-w-0">
        {title && <p className="font-semibold">{title}</p>}
        <p className={`text-sm ${title ? 'mt-0.5' : ''}`}>{message}</p>
      </div>
      <button
        onClick={onClose}
        className="flex-shrink-0 p-1 rounded hover:bg-black/10 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

// ── Simple Toast Function (for non-context usage) ───────────────────────────
export const showToast = (type, message) => {
  // This creates a temporary toast without context
  // For full functionality, use ToastProvider and useToast hook
  const container = document.createElement('div');
  container.className = 'fixed top-4 right-4 z-[100] max-w-sm w-full';
  document.body.appendChild(container);

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  const colors = alertColors[type] || alertColors.info;

  container.innerHTML = `
    <div class="flex items-center gap-3 p-4 rounded-xl shadow-lg ${colors.bg} ${colors.text} border-l-4 ${colors.border}">
      <span class="text-lg">${icons[type]}</span>
      <p class="flex-1 text-sm">${message}</p>
    </div>
  `;

  setTimeout(() => {
    container.remove();
  }, 3000);
};

export default ToastProvider;
