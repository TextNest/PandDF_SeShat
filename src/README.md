# SeShat - AI 기반 제품 설명서 질의응답 시스템

LLM을 활용한 PDF 문서 요약 및 질의응답 기능 개발 프로젝트

## 📋 프로젝트 개요

**SeShat**은 전자제품 설명서를 AI 기반으로 분석하고, 사용자의 질문에 실시간으로 답변하는 RAG(Retrieval-Augmented Generation) 시스템입니다.

- **프로젝트 기간**: 2025.01 ~ 2025.02
- **팀명**: P&DF
- **기술 스택**: Next.js 14, TypeScript, CSS Modules, Zustand, React Query

---

## 🎯 핵심 기능

### 1. 사용자 기능 (모바일 최적화)
- ✅ **QR 기반 접근**: 제품 QR 코드 스캔 → 즉시 챗봇 접속
- ✅ **실시간 대화형 질의응답**: AI 기반 자연어 답변
- ✅ **출처 표시**: PDF 페이지 번호 및 문서명 인용
- ✅ **추천 질문**: 자주 묻는 질문 자동 추천
- ✅ **모바일 친화적 UI**: 터치 최적화, Safe Area 대응

### 2. 관리자 기능
- ✅ **대시보드**: 통계, 차트, 실시간 모니터링
- ✅ **문서 관리**: PDF 업로드, 드래그 앤 드롭, 버전 관리
- ✅ **FAQ 자동 생성**: 로그 분석 기반 AI 생성
- ✅ **로그 분석**: Top 질문, 응답 시간, 미답변 질문 추적
- ✅ **제품 관리**: 제품 등록 및 QR 코드 생성

---

## 🏗️ 프로젝트 구조

```
seshat-frontend/
├── public/                          # 정적 파일
│   ├── qr-codes/                   # QR 코드 이미지
│   ├── icons/                      # 아이콘
│   └── images/                     # 이미지
│
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── (user)/                # 사용자 영역 (모바일 최적화)
│   │   │   ├── chat/[productId]/ # 제품별 챗봇 페이지
│   │   │   ├── product/[id]/     # 제품 상세 페이지
│   │   │   └── layout.tsx        # 사용자 레이아웃 (모바일 헤더)
│   │   │
│   │   ├── (admin)/              # 관리자 영역
│   │   │   ├── dashboard/        # 대시보드
│   │   │   ├── documents/        # 문서 관리
│   │   │   ├── faq/              # FAQ 관리
│   │   │   ├── logs/             # 로그 분석
│   │   │   ├── products/         # 제품 관리
│   │   │   └── layout.tsx        # 관리자 레이아웃 (사이드바)
│   │   │
│   │   ├── layout.tsx            # 루트 레이아웃
│   │   ├── page.tsx              # 홈페이지
│   │   └── globals.css           # 전역 스타일
│   │
│   ├── components/               # 재사용 컴포넌트
│   │   ├── ui/                  # 기본 UI 컴포넌트
│   │   │   ├── Button/          # 버튼 컴포넌트
│   │   │   ├── Input/           # 입력 컴포넌트
│   │   │   ├── Card/            # 카드 컴포넌트
│   │   │   ├── Modal/           # 모달 컴포넌트
│   │   │   └── Toast/           # 토스트 알림
│   │   │
│   │   ├── chat/                # 채팅 관련
│   │   │   ├── ChatMessage/     # 메시지 버블
│   │   │   ├── SuggestedQuestions/ # 추천 질문
│   │   │   └── TypingIndicator/ # 타이핑 인디케이터
│   │   │
│   │   ├── document/            # 문서 관련
│   │   │   ├── DocumentList/    # 문서 목록
│   │   │   ├── DocumentCard/    # 문서 카드
│   │   │   └── DocumentUploader/ # 파일 업로더 (드래그 앤 드롭)
│   │   │
│   │   ├── dashboard/           # 대시보드
│   │   │   ├── StatsCard/       # 통계 카드
│   │   │   ├── QueryAnalytics/  # 질의 분석 차트
│   │   │   ├── TopQuestions/    # 자주 묻는 질문
│   │   │   ├── ResponseTimeChart/ # 응답 시간 차트
│   │   │   └── RecentActivity/  # 최근 활동
│   │   │
│   │   ├── faq/                 # FAQ
│   │   │   ├── FAQList/         # FAQ 목록
│   │   │   ├── FAQCard/         # FAQ 카드 (확장/축소)
│   │   │   └── FAQAutoGenerate/ # 자동 생성 결과
│   │   │
│   │   ├── logs/                # 로그 분석
│   │   │   ├── TopQuestionsTable/ # Top 질문 테이블
│   │   │   └── UnansweredQueries/ # 미답변 질문
│   │   │
│   │   └── layout/              # 레이아웃
│   │       ├── Header/          # PC 헤더
│   │       ├── MobileHeader/    # 모바일 헤더
│   │       ├── Sidebar/         # 관리자 사이드바
│   │       └── Footer/          # 푸터
│   │
│   ├── features/                # 기능별 모듈
│   │   ├── chat/
│   │   │   ├── hooks/
│   │   │   │   ├── useChat.ts         # 채팅 로직
│   │   │   │   └── useStreamingResponse.ts # 스트리밍
│   │   │   └── types/
│   │   │       └── chat.types.ts
│   │   │
│   │   ├── documents/hooks/
│   │   └── analytics/hooks/
│   │
│   ├── lib/                     # 유틸리티 및 설정
│   │   ├── api/
│   │   │   ├── client.ts        # Axios 인스턴스
│   │   │   ├── endpoints.ts     # API 엔드포인트
│   │   │   └── websocket.ts     # WebSocket 클라이언트
│   │   │
│   │   ├── hooks/               # 공통 커스텀 훅
│   │   │   ├── useDebounce.ts
│   │   │   └── useMediaQuery.ts
│   │   │
│   │   ├── utils/               # 유틸리티 함수
│   │   │   ├── format.ts        # 날짜, 파일크기 포맷
│   │   │   └── validation.ts    # 유효성 검사
│   │   │
│   │   └── constants/           # 상수
│   │       ├── routes.ts        # 라우트 상수
│   │       ├── config.ts        # 설정 값
│   │       └── messages.ts      # 메시지 상수
│   │
│   ├── store/                   # 전역 상태 (Zustand)
│   │   ├── useChatStore.ts      # 채팅 상태
│   │   └── index.ts
│   │
│   ├── types/                   # TypeScript 타입
│   │   ├── chat.types.ts        # 채팅 타입
│   │   ├── document.types.ts    # 문서 타입
│   │   ├── faq.types.ts         # FAQ 타입
│   │   └── log.types.ts         # 로그 타입
│   │
│   └── styles/                  # 전역 스타일
│       ├── globals.css          # 전역 스타일
│       ├── variables.css        # CSS 변수 (색상, 간격 등)
│       ├── reset.css            # CSS 리셋
│       ├── typography.css       # 타이포그래피
│       └── utilities.css        # 유틸리티 클래스
│
├── .env.local                   # 환경 변수 (gitignore)
├── .env.example                 # 환경 변수 예시
├── next.config.js               # Next.js 설정
├── tsconfig.json                # TypeScript 설정
└── package.json                 # 의존성 관리
```

---

## 🎨 디자인 시스템

### CSS Modules 기반 스타일링
- **변수 기반**: `variables.css`에서 색상, 간격, 폰트 정의
- **컴포넌트별 스타일**: 각 컴포넌트 폴더에 `.module.css` 포함
- **재사용 클래스**: `utilities.css`에서 flex, margin 등 제공

### 색상 팔레트
```css
--color-primary: #3B82F6      /* 메인 블루 */
--color-success: #10B981      /* 성공 그린 */
--color-warning: #F59E0B      /* 경고 오렌지 */
--color-error: #EF4444        /* 에러 레드 */
--color-secondary: #8B5CF6    /* 세컨더리 퍼플 */
```

### 모바일 최적화
- **터치 영역**: 최소 44px 이상
- **Safe Area 대응**: iOS 노치 영역 고려
- **하단 고정 입력창**: 채팅 UX 최적화

---

## 🚀 시작하기

### 1. 설치
```bash
# 의존성 설치
npm install
```

### 2. 환경 변수 설정
```bash
# .env.local 파일 생성
cp .env.example .env.local

# 환경 변수 수정
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
OPENAI_API_KEY=your_api_key_here
```

### 3. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 접속

### 4. 빌드
```bash
npm run build
npm start
```

---

## 📦 주요 의존성

### Core
```json
{
  "next": "^14.2.0",
  "react": "^18.3.1",
  "typescript": "^5.4.3"
}
```

### 상태 관리
```json
{
  "zustand": "^4.5.2",
  "@tanstack/react-query": "^5.28.0"
}
```

### API & 통신
```json
{
  "axios": "^1.6.8",
  "socket.io-client": "^4.7.5"
}
```

### 폼 & 유효성 검사
```json
{
  "react-hook-form": "^7.51.2",
  "zod": "^3.22.4"
}
```

### UI & 차트
```json
{
  "lucide-react": "^0.363.0",
  "recharts": "^2.12.3",
  "react-qr-code": "^2.0.12"
}
```

---

## 🔧 개발 가이드

### 컴포넌트 생성 규칙
```
ComponentName/
├── ComponentName.tsx       # 컴포넌트 로직
└── ComponentName.module.css # 스타일
```

### 타입 정의
- 모든 Props는 interface로 정의
- API 응답은 `types/` 폴더에서 관리
- 공통 타입은 `common.types.ts`에 정의

### API 연동
```typescript
// lib/api/client.ts 사용
import apiClient from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';

const response = await apiClient.post(
  API_ENDPOINTS.CHAT.SEND_MESSAGE,
  { message: 'Hello' }
);
```

### 스타일링
```typescript
// CSS Modules 사용
import styles from './Component.module.css';

<div className={styles.container}>
  <h1 className={styles.title}>제목</h1>
</div>
```

---

## 📱 주요 페이지

### 사용자 페이지 (모바일 최적화)
| 경로 | 설명 |
|------|------|
| `/` | 홈페이지 |
| `/chat/[productId]` | 제품별 챗봇 페이지 |
| `/product/[id]` | 제품 상세 페이지 |

### 관리자 페이지
| 경로 | 설명 |
|------|------|
| `/dashboard` | 대시보드 (통계, 차트) |
| `/documents` | 문서 관리 (목록, 검색) |
| `/documents/upload` | 문서 업로드 (드래그 앤 드롭) |
| `/faq` | FAQ 관리 (목록, 편집) |
| `/faq/auto-generate` | FAQ 자동 생성 |
| `/logs` | 로그 분석 (Top 질문, 미답변) |
| `/products` | 제품 관리 |

---

## 🔑 핵심 커스텀 훅

### useChat
```typescript
const { 
  messages, 
  isLoading, 
  sendMessage, 
  clearMessages 
} = useChat(productId);
```
채팅 메시지 관리 및 API 통신

### useDebounce
```typescript
const debouncedValue = useDebounce(searchQuery, 500);
```
검색 입력 디바운싱

### useMediaQuery
```typescript
const isMobile = useIsMobile(); // < 768px
const isTablet = useIsTablet(); // 769px ~ 1024px
const isDesktop = useIsDesktop(); // > 1025px
```
반응형 레이아웃 감지

---

## 🧩 주요 컴포넌트

### Button
```typescript
<Button variant="primary" size="lg" loading>
  저장
</Button>
```
- variant: primary, secondary, outline, ghost, danger
- size: sm, md, lg

### Input
```typescript
<Input 
  label="이메일"
  error="필수 항목입니다"
  required
  fullWidth
/>
```

### Modal
```typescript
<Modal isOpen={true} onClose={() => {}} title="제목">
  내용
</Modal>
```

### DocumentUploader
```typescript
<DocumentUploader onFileSelect={(file) => {}} />
```
드래그 앤 드롭 파일 업로드

---

## 🎯 개발 현황

### ✅ 완료된 기능
- [x] 프로젝트 초기 설정
- [x] 폴더 구조 및 아키텍처 구성
- [x] 전역 스타일 시스템 (CSS Modules)
- [x] 기본 UI 컴포넌트 (Button, Input, Card, Modal, Toast)
- [x] 레이아웃 (사용자/관리자)
- [x] 사용자 채팅 페이지 (모바일 최적화)
- [x] 관리자 대시보드 (통계, 차트)
- [x] 문서 관리 시스템 (업로드, 목록, 드래그 앤 드롭)
- [x] FAQ 관리 시스템 (목록, 자동 생성)
- [x] 로그 분석 (Top 질문, 응답 시간, 미답변)

### 🔄 진행 중
- [ ] 제품 관리 시스템
- [ ] QR 코드 생성 기능
- [ ] 백엔드 API 연동

### 📝 예정
- [ ] 실시간 스트리밍 응답 구현
- [ ] WebSocket 연동
- [ ] 문서 버전 관리
- [ ] 다국어 지원
- [ ] 음성 질의응답 (ASR/TTS)

---

## 🐛 알려진 이슈

1. **API 연동 대기**: 현재 목 데이터(mock data) 사용 중
2. **WebSocket 미구현**: 실시간 스트리밍 응답 준비 중
3. **인증/인가**: 관리자 로그인 기능 미구현

---

## 📚 참고 문서

- [Next.js 14 Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Recharts Documentation](https://recharts.org/)

---

## 👥 팀원

- **이수현**: 설계 및 DB 구축
- **김현태**: Back-end 리드
- **서현수**: Front-end 리드
- **이동인**: PM
- **이도훈**: Front-end
- **정국호**: Back-end 리드

---

## 📄 라이선스

This project is private and confidential.

---

## 📞 문의

프로젝트 관련 문의: [프로젝트 담당자 이메일]

---

**Last Updated**: 2025.01.22