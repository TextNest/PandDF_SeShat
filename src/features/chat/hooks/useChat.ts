'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Message, SendMessageRequest } from '@/types/chat.types';
// 💡 apiClient와 API_ENDPOINTS는 WebSocket을 사용하므로 이 훅에서는 제거합니다.
// import apiClient from '@/lib/api/client';
// import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { useChatSession } from './useChatSession';

// 💡 사용자 요청에 따라 모든 함수는 에로우 함수로 작성합니다.
export const useChat = (productId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const ws = useRef<WebSocket | null>(null);

  const {
    sessionId,
    sessions,
    isLoading: isSessionLoading,
    saveMessages,
    loadSession,
    startNewSession,
    deleteSession,
  } = useChatSession(productId);

  // --- WebSocket 연결 로직 ---
  useEffect(() => {
    // 💡 연결 및 이벤트 핸들러 설정 함수
    const connectWebSocket = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('인증 토큰이 없습니다. 로그인해주세요.');
        return;
      }

      // 1. 동적으로 WebSocket 주소 생성
      const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      // 💡 백엔드(@app.websocket("/ws/{pid}"))와 경로를 일치시킵니다.
      // 💡 토큰과 sessionId를 쿼리 파라미터로 전송 (백엔드에서 처리 필요)
      const wsUrl = `${wsProtocol}//localhost:8000/ws/${productId}`;
      
      console.log(`WebSocket 연결 시도: ${wsUrl}`);
      
      const wsInstance = new WebSocket(wsUrl);
      ws.current = wsInstance;

      // --- 이벤트 핸들러 ---
      wsInstance.onopen = () => {
        console.log('WebSocket 연결 성공');
        setError(null);
        
        // 💡 연결 성공 시, 초기 메시지 요청 (선택 사항)
        // wsInstance.send(JSON.stringify({ type: 'init' }));
      };

      wsInstance.onclose = (event) => {
        if (!event.wasClean) {
          console.error('WebSocket 비정상 종료');
          setError('채팅 서버와 연결이 끊어졌습니다. 페이지를 새로고침해주세요.');
        }
        console.log('WebSocket 연결 종료');
        setIsLoading(false);
      };

      wsInstance.onerror = (error) => {
        console.error('WebSocket 오류 발생:', error);
        setError('WebSocket 연결 중 오류가 발생했습니다.');
        setIsLoading(false);
      };

      wsInstance.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          // 2. 백엔드에서 보낸 데이터 타입에 따라 분기 처리
          switch (data.type) {
            // 💡 텍스트 스트림 조각 수신
            case 'bot_stream':
              setMessages(prev => {
                const lastMessage = prev[prev.length - 1];
                // 마지막 메시지가 봇 메시지이면, content에 토큰을 이어 붙임
                if (lastMessage && lastMessage.role === 'assistant') {
                  return [
                    ...prev.slice(0, -1),
                    { ...lastMessage, content: lastMessage.content + data.token }
                  ];
                }
                // 아니라면, 새로운 봇 메시지 생성
                return [
                  ...prev,
                  {
                    id: `bot-${Date.now()}`,
                    role: 'assistant',
                    content: data.token,
                    timestamp: new Date().toISOString()
                  }
                ];
              });
              break;

            // 💡 이미지 수신 (사용자 정의)
            case 'bot_image':
              const newImage: Message = {
                id: `bot-img-${Date.now()}`,
                role: 'assistant',
                content: '', // 이미지는 content 대신 img 키로 처리 (타입 정의 필요)
                // img: data.img, // 💡 백엔드에서 'img' 키로 보낸다고 가정
                timestamp: new Date().toISOString()
              };
              setMessages(prev => [...prev, newImage]);
              break;
              
            // 💡 스트림 종료 신호
            case 'stream_end':
              setIsLoading(false);
              console.log("스트림 종료");
              break;
              
            // 💡 (예: 초기 메시지) 일반 봇 메시지
            case 'bot':
              const botMessage: Message = {
                id: `bot-${Date.now()}`,
                role: 'assistant',
                content: data.message,
                timestamp: new Date().toISOString()
              };
              setMessages(prev => [...prev, botMessage]);
              break;
          }
        } catch (e) {
          console.error('수신 데이터 처리 오류:', e);
        }
      };
    };

    connectWebSocket();

    // 💡 Clean-up 함수: 컴포넌트 언마운트 또는 의존성 변경 시 기존 연결 해제
    return () => {
      if (ws.current) {
        ws.current.close();
        ws.current = null;
      }
    };
  }, [productId, sessionId]); // productId 또는 sessionId 변경 시 WebSocket 재연결

  // ... (메시지 저장, 스크롤 로직은 기존과 동일) ...
   useEffect(() => {
     if (messages.length > 1 && sessionId) {
       saveMessages(messages);
     }
   }, [messages, sessionId, saveMessages]);

   const scrollToBottom = useCallback(() => {
     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
   }, []);

   useEffect(() => {
     scrollToBottom();
   }, [messages, scrollToBottom]);

  // --- 메시지 전송 (WebSocket.send 사용) ---
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
      setError('WebSocket 연결이 준비되지 않았습니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: content.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true); // 💡 스트림 종료 시 false로 변경됨
    setError(null);

    try {
      // 3. 💡 백엔드(FastAPI)가 receive_text()를 사용하므로 순수 텍스트 전송
      ws.current.send(content.trim());
      
      // 💡 응답 처리는 ws.current.onmessage에서 비동기적으로 이루어집니다.

    } catch (err: any) {
      setError('메시지 전송 중 오류가 발생했습니다.');
      setIsLoading(false);
      
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: '죄송합니다. 메시지 전송에 실패했습니다. 다시 시도해주세요.',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  }, [productId, sessionId]); // 💡 의존성 배열 업데이트

  // ... (세션 관련 핸들러 함수들은 기존과 동일) ...
  const handleLoadSession = useCallback(async (loadSessionId: string) => {
    const loadedMessages = await loadSession(loadSessionId);
    if (loadedMessages.length > 0) {
      setMessages(loadedMessages);
    }
  }, [loadSession]);

  const handleNewSession = useCallback(async () => {
    await startNewSession();
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: '안녕하세요! 무엇을 도와드릴까요?',
        timestamp: new Date().toISOString(),
      }
    ]);
  }, [startNewSession]);

  const clearMessages = useCallback(() => {
    setMessages([
    ]);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    messagesEndRef,
    // 세션 관련
    sessionId,
    sessions,
    isSessionLoading,
    loadSession: handleLoadSession,
    startNewSession: handleNewSession,
    deleteSession,
  };
};