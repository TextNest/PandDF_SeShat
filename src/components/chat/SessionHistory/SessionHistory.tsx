// ============================================
// 📄 3. src/components/chat/SessionHistory/SessionHistory.tsx
// ============================================
// 세션 히스토리 사이드바
// ============================================

'use client';

import { useState } from 'react';
import { History, Trash2, Plus, MessageSquare } from 'lucide-react';
import { ChatSession } from '@/lib/db/indexedDB';
import { formatRelativeTime } from '@/lib/utils/format';
import Button from '@/components/ui/Button/Button';
import styles from './SessionHistory.module.css';

interface SessionHistoryProps {
  sessions: ChatSession[];
  currentSessionId: string;
  onSelectSession: (sessionId: string) => void;
  onNewSession: () => void;
  onDeleteSession: (sessionId: string) => void;
}

export default function SessionHistory({
  sessions,
  currentSessionId,
  onSelectSession,
  onNewSession,
  onDeleteSession,
}: SessionHistoryProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    if (confirm('이 대화를 삭제하시겠습니까?')) {
      onDeleteSession(sessionId);
    }
  };

  return (
    <>
      {/* 토글 버튼 */}
      <button 
        className={styles.toggleButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="대화 기록"
      >
        <History size={20} />
      </button>

      {/* 사이드바 */}
      {isOpen && (
        <>
          <div className={styles.backdrop} onClick={() => setIsOpen(false)} />
          <div className={styles.sidebar}>
            <div className={styles.header}>
              <h3 className={styles.title}>
                <MessageSquare size={20} />
                대화 기록
              </h3>
              <Button variant="primary" size="sm" onClick={onNewSession}>
                <Plus size={16} />
                새 대화
              </Button>
            </div>

            <div className={styles.sessionList}>
              {sessions.length === 0 ? (
                <div className={styles.empty}>
                  <p>저장된 대화가 없습니다</p>
                </div>
              ) : (
                sessions.map((session) => (
                  <div
                    key={session.id}
                    className={`${styles.sessionItem} ${
                      session.id === currentSessionId ? styles.active : ''
                    }`}
                    onClick={() => {
                      onSelectSession(session.id);
                      setIsOpen(false);
                    }}
                  >
                    <div className={styles.sessionInfo}>
                      <div className={styles.sessionTitle}>
                        {session.messages.length > 0
                          ? session.messages[0].content.substring(0, 30) + '...'
                          : '새 대화'}
                      </div>
                      <div className={styles.sessionMeta}>
                        <span>{session.messages.length}개 메시지</span>
                        <span>·</span>
                        <span>{formatRelativeTime(new Date(session.updatedAt))}</span>
                      </div>
                    </div>
                    <button
                      className={styles.deleteButton}
                      onClick={(e) => handleDelete(e, session.id)}
                      aria-label="삭제"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}