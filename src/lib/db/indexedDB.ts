// ============================================
// 📄 1. src/lib/db/indexedDB.ts
// ============================================
// IndexedDB 초기화 및 관리
// ============================================

const DB_NAME = 'seshat-db';
const DB_VERSION = 1;
const CHAT_STORE = 'chat-sessions';

export interface ChatSession {
  id: string;
  productId: string;
  productName?: string;
  messages: any[];
  createdAt: number;
  updatedAt: number;
}

class IndexedDBManager {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        reject(new Error('IndexedDB를 열 수 없습니다'));
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // 채팅 세션 스토어 생성
        if (!db.objectStoreNames.contains(CHAT_STORE)) {
          const store = db.createObjectStore(CHAT_STORE, { keyPath: 'id' });
          store.createIndex('productId', 'productId', { unique: false });
          store.createIndex('updatedAt', 'updatedAt', { unique: false });
        }
      };
    });
  }

  async saveSession(session: ChatSession): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([CHAT_STORE], 'readwrite');
      const store = transaction.objectStore(CHAT_STORE);
      const request = store.put(session);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('세션 저장 실패'));
    });
  }

  async getSession(sessionId: string): Promise<ChatSession | null> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([CHAT_STORE], 'readonly');
      const store = transaction.objectStore(CHAT_STORE);
      const request = store.get(sessionId);

      request.onsuccess = () => {
        resolve(request.result || null);
      };
      request.onerror = () => reject(new Error('세션 조회 실패'));
    });
  }

  async getSessionsByProduct(productId: string): Promise<ChatSession[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([CHAT_STORE], 'readonly');
      const store = transaction.objectStore(CHAT_STORE);
      const index = store.index('productId');
      const request = index.getAll(productId);

      request.onsuccess = () => {
        resolve(request.result || []);
      };
      request.onerror = () => reject(new Error('세션 목록 조회 실패'));
    });
  }

  async getAllSessions(): Promise<ChatSession[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([CHAT_STORE], 'readonly');
      const store = transaction.objectStore(CHAT_STORE);
      const request = store.getAll();

      request.onsuccess = () => {
        const sessions = request.result || [];
        // 최신순 정렬
        sessions.sort((a, b) => b.updatedAt - a.updatedAt);
        resolve(sessions);
      };
      request.onerror = () => reject(new Error('전체 세션 조회 실패'));
    });
  }

  async deleteSession(sessionId: string): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([CHAT_STORE], 'readwrite');
      const store = transaction.objectStore(CHAT_STORE);
      const request = store.delete(sessionId);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('세션 삭제 실패'));
    });
  }

  async clearAllSessions(): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([CHAT_STORE], 'readwrite');
      const store = transaction.objectStore(CHAT_STORE);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('전체 세션 삭제 실패'));
    });
  }
}

export const dbManager = new IndexedDBManager();