// ============================================
// 📄 9. src/components/dashboard/RecentActivity/RecentActivity.tsx
// ============================================
// 최근 활동 로그
// ============================================

import { Clock, FileText, MessageSquare, Upload } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils/format';
import styles from './RecentActivity.module.css';

const activities = [
  {
    id: 1,
    type: 'message',
    title: '새로운 질문',
    description: '제품 사용법이 궁금해요',
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5분 전
  },
  {
    id: 2,
    type: 'upload',
    title: '문서 업로드',
    description: '세탁기_WM-2024.pdf',
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30분 전
  },
  {
    id: 3,
    type: 'message',
    title: '새로운 질문',
    description: '고장이 났어요',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2시간 전
  },
  {
    id: 4,
    type: 'document',
    title: '문서 갱신',
    description: '냉장고_RF-2024.pdf',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5시간 전
  },
];

const iconMap = {
  message: MessageSquare,
  upload: Upload,
  document: FileText,
};

export default function RecentActivity() {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          <Clock size={20} />
          최근 활동
        </h3>
        <a href="/logs" className={styles.viewAll}>전체 보기</a>
      </div>
      
      <div className={styles.timeline}>
        {activities.map((activity) => {
          const Icon = iconMap[activity.type as keyof typeof iconMap];
          
          return (
            <div key={activity.id} className={styles.item}>
              <div className={styles.iconWrapper}>
                <Icon size={16} />
              </div>
              <div className={styles.content}>
                <div className={styles.itemTitle}>{activity.title}</div>
                <div className={styles.description}>{activity.description}</div>
              </div>
              <time className={styles.timestamp}>
                {formatRelativeTime(activity.timestamp)}
              </time>
            </div>
          );
        })}
      </div>
    </div>
  );
}
