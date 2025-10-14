// ============================================
// 📄 9. src/components/ui/Toast/Toast.tsx
// ============================================
// 토스트 알림 컴포넌트
// ============================================

'use client';

import { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import styles from './Toast.module.css';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onClose: () => void;
}

export default function Toast({
  message,
  type = 'info',
  duration = 3000,
  onClose
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle size={20} />,
    error: <AlertCircle size={20} />,
    info: <Info size={20} />
  };

  return (
    <div className={`${styles.toast} ${styles[type]}`}>
      <div className={styles.icon}>
        {icons[type]}
      </div>
      <p className={styles.message}>{message}</p>
      <button 
        className={styles.closeButton}
        onClick={onClose}
        aria-label="닫기"
      >
        <X size={18} />
      </button>
    </div>
  );
}
