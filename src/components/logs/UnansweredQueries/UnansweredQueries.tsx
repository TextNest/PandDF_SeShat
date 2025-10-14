// ============================================
// 📄 1. src/components/logs/UnansweredQueries/UnansweredQueries.tsx
// ============================================
// 미답변 질문 컴포넌트
// ============================================

import { MessageSquare, Package, Clock, Plus } from 'lucide-react';
import { UnansweredQuery } from '@/types/log.types';
import { formatRelativeTime } from '@/lib/utils/format';
import Button from '@/components/ui/Button/Button';
import styles from './UnansweredQueries.module.css';

interface UnansweredQueriesProps {
  queries: UnansweredQuery[];
}

export default function UnansweredQueries({ queries }: UnansweredQueriesProps) {
  if (queries.length === 0) {
    return (
      <div className={styles.empty}>
        <p>미답변 질문이 없습니다</p>
      </div>
    );
  }

  const handleAddToFAQ = (queryId: string) => {
    alert(`FAQ로 추가: ${queryId}`);
    // TODO: FAQ 추가 로직
  };

  return (
    <div className={styles.list}>
      {queries.map((query) => (
        <div key={query.id} className={styles.queryCard}>
          <div className={styles.cardHeader}>
            <div className={styles.iconWrapper}>
              <MessageSquare size={20} />
            </div>
            <div className={styles.headerContent}>
              <h4 className={styles.question}>{query.question}</h4>
              <div className={styles.meta}>
                <span className={styles.metaItem}>
                  <Package size={14} />
                  {query.productName}
                </span>
                <span className={styles.metaItem}>
                  <Clock size={14} />
                  {formatRelativeTime(query.timestamp)}
                </span>
                <span className={styles.attempts}>
                  {query.attemptCount}회 시도
                </span>
              </div>
            </div>
          </div>

          <div className={styles.actions}>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleAddToFAQ(query.id)}
            >
              <Plus size={16} />
              FAQ 추가
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}