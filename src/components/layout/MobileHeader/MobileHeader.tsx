// ============================================
// 📄 3. src/components/layout/MobileHeader/MobileHeader.tsx
// ============================================
// 모바일 전용 헤더
// ============================================

'use client';

import { ArrowLeft, Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';
import styles from './MobileHeader.module.css';

export default function MobileHeader() {
  const router = useRouter();
  
  return (
    <header className={styles.header}>
      <button 
        className={styles.backButton}
        onClick={() => router.back()}
        aria-label="뒤로 가기"
      >
        <ArrowLeft size={24} />
      </button>
      
      <h1 className={styles.title}>SeShat</h1>
      
      <button 
        className={styles.menuButton}
        aria-label="메뉴"
      >
        <Menu size={24} />
      </button>
    </header>
  );
}