// ============================================
// 📄 3. src/types/chat.types.ts
// ============================================
// 채팅 관련 타입 정의
// ============================================

export interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  sources?: Source[];
  isStreaming?: boolean;
}

export interface Source {
  page: number;
  content: string;
  documentName: string;
}

export interface ChatSession {
  id: string;
  productId: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SendMessageRequest {
  productId: string;
  message: string;
  sessionId?: string;
}

export interface SendMessageResponse {
  messageId: string;
  response: string;
  sources?: Source[];
}