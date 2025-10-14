// ============================================
// 📄 1. src/app/(admin)/dashboard/page.tsx
// ============================================
// 관리자 대시보드 메인 페이지 (고도화)
// ============================================

import StatsCard from '@/components/dashboard/StatsCard/StatsCard';
import QueryAnalytics from '@/components/dashboard/QueryAnalytics/QueryAnalytics';
import TopQuestions from '@/components/dashboard/TopQuestions/TopQuestions';
import RecentActivity from '@/components/dashboard/RecentActivity/RecentActivity';
import styles from './dashboard-page.module.css';

export default function DashboardPage() {
  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1>대시보드</h1>
        <p className={styles.subtitle}>시스템 현황을 한눈에 확인하세요</p>
      </div>
      
      {/* 통계 카드 */}
      <div className={styles.statsGrid}>
        <StatsCard
          title="총 문서 수"
          value={24}
          change={+12}
          icon="file"
          color="primary"
        />
        <StatsCard
          title="총 질문 수"
          value={1547}
          change={+23}
          icon="message"
          color="success"
        />
        <StatsCard
          title="평균 응답 시간"
          value="2.3s"
          change={-15}
          icon="clock"
          color="secondary"
        />
        <StatsCard
          title="FAQ 항목"
          value={156}
          change={+8}
          icon="help"
          color="warning"
        />
      </div>
      
      {/* 차트 영역 */}
      <div className={styles.chartsGrid}>
        <QueryAnalytics />
        <TopQuestions />
      </div>
      
      {/* 최근 활동 */}
      <RecentActivity />
    </div>
  );
}