// ============================================
// 📄 4. src/features/chat/hooks/useChat.ts
// ============================================
// 채팅 커스텀 훅
// ============================================

'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Message, SendMessageRequest } from '@/types/chat.types';
import apiClient from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';

export function useChat(productId: string) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: '안녕하세요! 무엇을 도와드릴까요?',
      timestamp: new Date(),
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 스크롤 하단으로 이동
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // 메시지 전송
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const request: SendMessageRequest = {
        productId,
        message: content.trim(),
      };

      const response = await apiClient.post(
        API_ENDPOINTS.CHAT.SEND_MESSAGE,
        request
      );

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        type: 'bot',
        content: response.data.response,
        timestamp: new Date(),
        sources: response.data.sources,
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (err: any) {
      setError(err.response?.data?.message || '오류가 발생했습니다.');
      
      // 에러 메시지 표시
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        type: 'bot',
        content: '죄송합니다. 응답을 생성하는 중 오류가 발생했습니다. 다시 시도해주세요.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  // 대화 초기화
  const clearMessages = useCallback(() => {
    setMessages([
      {
        id: '1',
        type: 'bot',
        content: '안녕하세요! 무엇을 도와드릴까요?',
        timestamp: new Date(),
      }
    ]);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    messagesEndRef,
  };
}