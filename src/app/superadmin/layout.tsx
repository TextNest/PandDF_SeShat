'use client';

import SuperAdminSidebar from '@/components/layout/SuperAdminSidebar/SuperAdminSidebar';
import styles from './layout.module.css';

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.layout}>
      <SuperAdminSidebar />
      <main className={styles.main}>{children}</main>
    </div>
  );
}