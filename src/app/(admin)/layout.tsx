// ============================================
// 📄 4. src/app/(admin)/layout.tsx
// ============================================
// 관리자 영역 레이아웃 (대시보드, 문서 관리 등)
// ============================================

import Sidebar from '@/components/layout/Sidebar/Sidebar';
import styles from './admin-layout.module.css';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.adminLayout}>
      <Sidebar />
      <div className={styles.mainContent}>
        <header className={styles.header}>
          <h1 className={styles.title}>SeShat 관리자</h1>
          <div className={styles.userMenu}>
            <span>관리자님</span>
          </div>
        </header>
        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
}