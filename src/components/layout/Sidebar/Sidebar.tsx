// ============================================
// 📄 10. src/components/layout/Sidebar/Sidebar.tsx
// ============================================
// 관리자 사이드바
// ============================================

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileText, 
  MessageCircle, 
  BarChart3, 
  Package,
  Settings
} from 'lucide-react';
import styles from './Sidebar.module.css';

const menuItems = [
  {
    icon: LayoutDashboard,
    label: '대시보드',
    href: '/dashboard',
  },
  // 🔥 제품 관리를 문서 관리 앞으로!
  {
    icon: Package,
    label: '제품 관리',
    href: '/products',
  },
  {
    icon: FileText,
    label: '문서 관리',
    href: '/documents',
  },
  {
    icon: MessageCircle,
    label: 'FAQ 관리',
    href: '/faq',
  },
  {
    icon: BarChart3,
    label: '로그 분석',
    href: '/logs',
  },
  {
    icon: Settings,
    label: '설정',
    href: '/profile',
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <h2>ManuAI-Talk</h2>
        <span className={styles.badge}>Admin</span>
      </div>
      
      <nav className={styles.nav}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link 
              key={item.href}
              href={item.href}
              className={`${styles.navItem} ${isActive ? styles.active : ''}`}
            >
              <Icon className={styles.icon} size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
