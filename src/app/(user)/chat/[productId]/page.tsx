// ============================================
// 📄 2. src/app/(user)/chat/[productId]/page.tsx (업데이트)
// ============================================
// 세션 기능이 통합된 채팅 페이지
// ============================================

'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import { useChat } from '@/features/chat/hooks/useChat';
import ChatMessage from '@/components/chat/ChatMessage/ChatMessage';
import SuggestedQuestions from '@/components/chat/SuggestedQuestions/SuggestedQuestions';
import TypingIndicator from '@/components/chat/TypingIndicator/TypingIndicator';
import SessionHistory from '@/components/chat/SessionHistory/SessionHistory';
import styles from './chat-page.module.css';

const SUGGESTED_QUESTIONS = [
  '제품 사용법이 궁금해요',
  '고장이 났어요',
  'A/S는 어떻게 받나요?',
  '설치 방법을 알려주세요',
];

export default function ChatPage({ 
  params 
}: { 
  params: { productId: string } 
}) {
  const [inputValue, setInputValue] = useState('');
  const { 
    messages, 
    isLoading, 
    sendMessage, 
    messagesEndRef,
    // 세션 관련
    sessionId,
    sessions,
    isSessionLoading,
    loadSession,
    startNewSession,
    deleteSession,
  } = useChat(params.productId);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;
    
    await sendMessage(inputValue);
    setInputValue('');
  };

  const handleSuggestedQuestion = (question: string) => {
    setInputValue(question);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // 세션 로딩 중
  if (isSessionLoading) {
    return (
      <div className={styles.chatPage}>
        <div className={styles.loadingContainer}>
          <p>대화를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.chatPage}>
      {/* 세션 히스토리 사이드바 */}
      <SessionHistory
        sessions={sessions}
        currentSessionId={sessionId}
        onSelectSession={loadSession}
        onNewSession={startNewSession}
        onDeleteSession={deleteSession}
      />

      {/* 제품 정보 헤더 */}
      <div className={styles.productInfo}>
        <p className={styles.productId}>제품: {params.productId}</p>
      </div>

      {/* 메시지 영역 */}
      <div className={styles.messageArea}>
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        
        {isLoading && <TypingIndicator />}
        
        <div ref={messagesEndRef} />
      </div>

      {/* 추천 질문 (메시지가 1개일 때만) */}
      {messages.length === 1 && !isLoading && (
        <SuggestedQuestions 
          questions={SUGGESTED_QUESTIONS}
          onSelect={handleSuggestedQuestion}
        />
      )}

      {/* 입력 영역 */}
      <div className={styles.inputArea}>
        <input
          type="text"
          className={styles.input}
          placeholder="메시지를 입력하세요..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
        />
        <button 
          className={styles.sendButton}
          onClick={handleSend}
          disabled={!inputValue.trim() || isLoading}
          aria-label="전송"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}
