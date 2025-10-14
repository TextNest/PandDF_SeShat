// ============================================
// 📄 2. src/app/(admin)/logs/page.tsx
// ============================================
// 로그 분석 페이지
// ============================================

'use client';

import { useState } from 'react';
import { BarChart3, Clock, CheckCircle, ThumbsUp, AlertCircle } from 'lucide-react';
import ResponseTimeChart from '@/components/dashboard/ResponseTimeChart/ResponseTimeChart';
import TopQuestionsTable from '@/components/logs/TopQuestionsTable/TopQuestionsTable';
import UnansweredQueries from '@/components/logs/UnansweredQueries/UnansweredQueries';
import { TopQuestion, UnansweredQuery } from '@/types/log.types';
import styles from './logs-page.module.css';

// 임시 데이터
const mockTopQuestions: TopQuestion[] = [
  { question: '제품 사용법이 궁금해요', count: 234, averageResponseTime: 2.3, helpfulRate: 0.89 },
  { question: '고장이 났어요', count: 187, averageResponseTime: 3.1, helpfulRate: 0.82 },
  { question: 'A/S는 어떻게 받나요?', count: 156, averageResponseTime: 1.8, helpfulRate: 0.95 },
  { question: '설치 방법을 알려주세요', count: 143, averageResponseTime: 2.5, helpfulRate: 0.87 },
  { question: '제품 보증 기간은?', count: 128, averageResponseTime: 1.5, helpfulRate: 0.92 },
];

const mockUnanswered: UnansweredQuery[] = [
  {
    id: '1',
    question: '이 제품은 해외에서도 사용 가능한가요?',
    productId: 'WM-2024',
    productName: '세탁기 WM-2024',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    attemptCount: 3,
  },
  {
    id: '2',
    question: '소음이 70dB 이상 나는데 정상인가요?',
    productId: 'WM-2024',
    productName: '세탁기 WM-2024',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    attemptCount: 2,
  },
];

export default function LogsPage() {
  const [dateRange, setDateRange] = useState('7days');

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>로그 분석</h1>
          <p className={styles.subtitle}>대화 로그와 사용자 질문을 분석합니다</p>
        </div>
        
        <select 
          className={styles.dateSelect}
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
        >
          <option value="24hours">최근 24시간</option>
          <option value="7days">최근 7일</option>
          <option value="30days">최근 30일</option>
          <option value="90days">최근 90일</option>
        </select>
      </div>

      {/* 핵심 지표 */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricIcon} style={{ backgroundColor: 'var(--color-primary)' }}>
            <BarChart3 size={24} />
          </div>
          <div className={styles.metricContent}>
            <div className={styles.metricValue}>1,547</div>
            <div className={styles.metricLabel}>총 질문 수</div>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricIcon} style={{ backgroundColor: 'var(--color-success)' }}>
            <Clock size={24} />
          </div>
          <div className={styles.metricContent}>
            <div className={styles.metricValue}>2.3s</div>
            <div className={styles.metricLabel}>평균 응답 시간</div>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricIcon} style={{ backgroundColor: 'var(--color-secondary)' }}>
            <CheckCircle size={24} />
          </div>
          <div className={styles.metricContent}>
            <div className={styles.metricValue}>94.2%</div>
            <div className={styles.metricLabel}>응답 성공률</div>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricIcon} style={{ backgroundColor: 'var(--color-warning)' }}>
            <ThumbsUp size={24} />
          </div>
          <div className={styles.metricContent}>
            <div className={styles.metricValue}>87.5%</div>
            <div className={styles.metricLabel}>도움이 됨</div>
          </div>
        </div>
      </div>

      {/* 응답 시간 차트 */}
      <ResponseTimeChart />

      {/* 자주 묻는 질문 Top 10 */}
      <TopQuestionsTable questions={mockTopQuestions} />

      {/* 미답변 질문 */}
      <div className={styles.unansweredSection}>
        <div className={styles.sectionHeader}>
          <h3>
            <AlertCircle size={20} />
            미답변 질문
          </h3>
          <span className={styles.badge}>{mockUnanswered.length}</span>
        </div>
        <UnansweredQueries queries={mockUnanswered} />
      </div>
    </div>
  );
}