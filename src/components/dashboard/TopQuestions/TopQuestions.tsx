// ============================================
// 📄 7. src/components/dashboard/TopQuestions/TopQuestions.tsx
// ============================================
// 자주 묻는 질문 Top 10
// ============================================

import { BarChart3 } from 'lucide-react';
import styles from './TopQuestions.module.css';

const topQuestions = [
  { question: '제품 사용법이 궁금해요', count: 234 },
  { question: '고장이 났어요', count: 187 },
  { question: 'A/S는 어떻게 받나요?', count: 156 },
  { question: '설치 방법을 알려주세요', count: 143 },
  { question: '제품 보증 기간은?', count: 128 },
];

export default function TopQuestions() {
  const maxCount = Math.max(...topQuestions.map(q => q.count));

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          <BarChart3 size={20} />
          자주 묻는 질문 Top 5
        </h3>
      </div>
      
      <div className={styles.list}>
        {topQuestions.map((item, index) => (
          <div key={index} className={styles.item}>
            <div className={styles.rank}>{index + 1}</div>
            <div className={styles.content}>
              <div className={styles.question}>{item.question}</div>
              <div className={styles.barWrapper}>
                <div 
                  className={styles.bar}
                  style={{ width: `${(item.count / maxCount) * 100}%` }}
                />
              </div>
            </div>
            <div className={styles.count}>{item.count}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
