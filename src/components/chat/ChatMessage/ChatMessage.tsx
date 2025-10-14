// ============================================
// 📄 6. src/components/chat/ChatMessage/ChatMessage.tsx
// ============================================
// 채팅 메시지 컴포넌트
// ============================================

import { Message } from '@/types/chat.types';
import { FileText } from 'lucide-react';
import styles from './ChatMessage.module.css';

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.type === 'user';

  return (
    <div className={`${styles.messageWrapper} ${isUser ? styles.user : styles.bot}`}>
      <div className={styles.messageContent}>
        <p className={styles.text}>{message.content}</p>
        
        {/* 출처 표시 */}
        {message.sources && message.sources.length > 0 && (
          <div className={styles.sources}>
            <p className={styles.sourcesTitle}>
              <FileText size={14} />
              출처
            </p>
            {message.sources.map((source, index) => (
              <div key={index} className={styles.sourceItem}>
                <span className={styles.sourcePage}>p.{source.page}</span>
                <span className={styles.sourceDoc}>{source.documentName}</span>
              </div>
            ))}
          </div>
        )}
        
        {/* 스트리밍 인디케이터 */}
        {message.isStreaming && (
          <span className={styles.streamingDot}>●</span>
        )}
      </div>
      
      <time className={styles.timestamp}>
        {new Date(message.timestamp).toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </time>
    </div>
  );
}