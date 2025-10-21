# SeShat - AI 기반 제품 설명서 질의응답 시스템

LLM을 활용한 PDF 문서 요약 및 질의응답 기능 개발 프로젝트

## 📋 프로젝트 개요

**SeShat**은 전자제품 설명서를 AI 기반으로 분석하고, 사용자의 질문에 실시간으로 답변하는 RAG(Retrieval-Augmented Generation) 시스템입니다.

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

### 2. 기업 관리자 기능
- ✅ **대시보드**: 통계, 차트, 실시간 모니터링
- ✅ **문서 관리**: PDF 업로드, 드래그 앤 드롭, 버전 관리
- ✅ **FAQ 자동 생성**: 로그 분석 기반 AI 생성
- ✅ **로그 분석**: Top 질문, 응답 시간, 미답변 질문 추적
- ✅ **제품 관리**: 제품 등록 및 QR 코드 생성
- ✅ **로그인/로그아웃**: 세션 기반 인증
- ✅ **회원가입**: 가입 코드 기반 등록

### 3. 슈퍼 관리자 기능 ✨ NEW (2025.10.21 완성!)
- ✅ **전체 대시보드**: 전체 기업 통계, 사용량 분석
- ✅ **기업 관리**: 기업 CRUD, 가입 코드 생성/관리, 상태 관리
- ✅ **사용자 관리**: 관리자 계정 목록, 검색/필터, 통계
- ✅ **시스템 설정**: LLM API, 기능 토글, 데이터 관리

---

## 🔐 3단계 권한 시스템

### 권한 구조
```
┌─────────────────────────────────────┐
│  🔴 Super Admin (슈퍼 관리자)       │
│  - 전체 기업 관리 ✅                │
│  - 기업 가입 코드 생성 ✅           │
│  - 관리자 계정 관리 ✅              │
│  - 시스템 설정 ✅                   │
├─────────────────────────────────────┤
│  🟡 Company Admin (기업 관리자)     │
│  - 회원가입 (가입 코드 필요) ✅     │
│  - 자기 회사 문서 관리 ✅           │
│  - 자기 회사 FAQ 관리 ✅            │
│  - 자기 회사 로그 분석 ✅           │
│  - 자기 회사 제품 관리 ✅           │
├─────────────────────────────────────┤
│  🟢 User (일반 사용자)              │
│  - QR 코드 스캔 ✅                  │
│  - 챗봇 질문 ✅                     │
│  - 제품 정보 조회 ✅                │
└─────────────────────────────────────┘
```

### 테스트 계정
```typescript
// 슈퍼 관리자
super@seshat.com / super123

// 기업 관리자
admin@samsung.com / admin123  // 삼성전자
admin@lg.com / admin123       // LG전자

// 회원가입 테스트 코드
SAMSUNG24  // 삼성전자
LG2024XY   // LG전자
HYUNDAI8   // 현대자동차
```

---

## 🏗️ 프로젝트 구조
```
seshat-frontend/
├── src/
│   ├── app/
│   │   ├── (user)/              # 일반 사용자 영역
│   │   │   ├── chat/[productId]/
│   │   │   └── product/[id]/
│   │   │
│   │   ├── (admin)/             # 기업 관리자 영역
│   │   │   ├── dashboard/
│   │   │   ├── documents/
│   │   │   ├── faq/
│   │   │   ├── logs/
│   │   │   └── products/
│   │   │
│   │   ├── superadmin/          # 슈퍼 관리자 영역 ✅ 완성!
│   │   │   ├── page.tsx         # 전체 대시보드 ✅
│   │   │   ├── companies/       # 기업 관리 ✅
│   │   │   │   └── page.tsx
│   │   │   ├── users/           # 사용자 관리 ✅
│   │   │   │   └── page.tsx
│   │   │   └── settings/        # 시스템 설정 ✅
│   │   │       └── page.tsx
│   │   │
│   │   ├── admin/
│   │   │   ├── login/           # 로그인 페이지 ✅
│   │   │   └── register/        # 회원가입 페이지 ✅
│   │   │
│   │   └── page.tsx             # 메인 페이지
│   │
│   ├── components/
│   │   ├── auth/                # 인증 컴포넌트 ✅
│   │   │   └── LoginForm/
│   │   │
│   │   └── layout/
│   │       ├── Sidebar/         # 기업 관리자 사이드바
│   │       └── SuperAdminSidebar/ # 슈퍼 관리자 사이드바 ✅
│   │
│   ├── features/
│   │   └── auth/
│   │       └── hooks/
│   │           └── useAuth.ts   # 3단계 권한 지원 ✅
│   │
│   ├── store/
│   │   └── useAuthStore.ts      # 인증 상태 (persist) ✅
│   │
│   └── types/
│       └── auth.types.ts        # 권한 타입 ✅
│
└── ...
```

---

## 🚀 시작하기

### 1. 설치
```bash
npm install
```

### 2. 환경 변수 설정
```bash
cp .env.example .env.local
```

### 3. 개발 서버 실행
```bash
npm run dev
```

### 4. 접속
```
메인: http://localhost:3000/
로그인: http://localhost:3000/admin/login
회원가입: http://localhost:3000/admin/register
슈퍼 관리자: http://localhost:3000/superadmin
```

---

## 📱 주요 페이지

### 사용자 페이지
| 경로 | 설명 | 상태 |
|------|------|------|
| `/` | 메인 페이지 | ✅ |
| `/chat/[productId]` | 제품별 챗봇 | ✅ |
| `/product/[id]` | 제품 상세 | ✅ |

### 기업 관리자 페이지
| 경로 | 설명 | 상태 |
|------|------|------|
| `/admin/login` | 로그인 | ✅ |
| `/admin/register` | 회원가입 (가입 코드) | ✅ |
| `/dashboard` | 대시보드 | ✅ |
| `/documents` | 문서 관리 | ✅ |
| `/faq` | FAQ 관리 | ✅ |
| `/logs` | 로그 분석 | ✅ |
| `/products` | 제품 관리 | ✅ |

### 슈퍼 관리자 페이지
| 경로 | 설명 | 상태 |
|------|------|------|
| `/superadmin` | 전체 대시보드 | ✅ |
| `/superadmin/companies` | 기업 관리 (가입 코드) | ✅ |
| `/superadmin/users` | 사용자 관리 (테이블) | ✅ |
| `/superadmin/settings` | 시스템 설정 | ✅ |

---

## 🎯 개발 현황

### ✅ 완료된 기능 (2025.10.21 기준)

#### 인증 시스템
- [x] **3단계 권한 구조** - Super Admin / Company Admin / User
- [x] **로그인** - 역할별 자동 리디렉션
- [x] **회원가입** - 가입 코드 기반 등록
  - [x] Step 1: 가입 코드 검증
  - [x] Step 2: 사용자 정보 입력 (이름, 이메일, 부서, 언어, 비밀번호)
  - [x] 부서: 기존 DB 목록 + 직접 입력
  - [x] 직책: 프로필에서 선택 입력
- [x] **로그아웃** - 세션 기반 (Zustand persist)
- [x] **권한별 접근 제어**

#### 사용자 기능
- [x] QR 코드 접속
- [x] 모바일 최적화 채팅 UI
- [x] 메시지 버블, 타이핑 인디케이터
- [x] 추천 질문
- [x] 제품 상세 페이지

#### 기업 관리자 기능
- [x] 대시보드 (통계, 차트)
- [x] 문서 관리 (업로드, 목록, 검색)
- [x] FAQ 관리 (CRUD, 자동생성 UI)
- [x] 로그 분석 (Top 질문, 미답변)
- [x] 제품 관리 (CRUD, QR 생성)

#### 슈퍼 관리자 기능 ✨ NEW!
- [x] **전체 대시보드**
  - [x] 통계 카드 (기업, 사용자, 문서, 질문)
  - [x] 최근 활동 목록
- [x] **기업 관리 페이지**
  - [x] 기업 카드 그리드 뷰
  - [x] 검색 및 필터 (상태별)
  - [x] 가입 코드 생성/표시/복사/재생성
  - [x] 드롭다운 메뉴 (코드 보기, 수정, 활성화/비활성화, 삭제)
  - [x] 가입 코드 모달
- [x] **사용자 관리 페이지**
  - [x] 사용자 테이블 뷰
  - [x] 검색 및 필터 (역할별, 상태별)
  - [x] 통계 카드 (전체, 슈퍼, 기업, 활성)
  - [x] 아바타 + 이름/이메일 표시
  - [x] 역할/상태 뱃지
- [x] **시스템 설정 페이지**
  - [x] 기본 설정 (사이트명, 업로드 크기, 세션)
  - [x] 기능 토글 (회원가입, 알림, 유지보수 모드)
  - [x] API 설정 (OpenAI, 임베딩, 채팅 모델)
  - [x] 데이터 관리 (백업, 로그, 캐시)

---

### 📝 예정 기능

#### 추가 기능
- [ ] **피드백 시스템** 👍👎
- [ ] **북마크 기능** ⭐
- [ ] **프로필 수정** (직책 입력)
- [ ] **요청사항 관리** (기업 → 슈퍼 관리자)
- [ ] **2D 설치 공간 시뮬레이션**

#### 백엔드 연동
- [ ] RAG 엔진 API 연동
- [ ] 문서 파싱 (PDF → 텍스트)
- [ ] 벡터 DB (FAISS/Pinecone)
- [ ] 로그 저장 DB
- [ ] WebSocket 실시간 통신

---

## 🗄️ DB 스키마 설계

### Users 테이블
```sql
CREATE TABLE users (
  user_id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  
  -- 시스템 권한
  role VARCHAR(20) NOT NULL, -- 'super_admin', 'company_admin'
  
  -- 소속 정보
  company_id INT,
  department VARCHAR(50) NOT NULL, -- 부서 (필수, 기존 목록 + 직접 입력)
  job_title VARCHAR(50), -- 직책 (선택, 프로필에서 입력)
  
  -- 환경 설정
  language_preference VARCHAR(10) DEFAULT 'ko', -- 'ko', 'en'
  
  -- 상태
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'inactive'
  
  -- 타임스탬프
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (company_id) REFERENCES companies(company_id)
);
```

### Companies 테이블
```sql
CREATE TABLE companies (
  company_id INT PRIMARY KEY AUTO_INCREMENT,
  company_name VARCHAR(100) NOT NULL,
  registration_code VARCHAR(20) UNIQUE NOT NULL, -- 가입 코드
  status VARCHAR(20) DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🎓 개발 가이드

### 회원가입 플로우
```
1. 사용자: /admin/register 접속
2. Step 1: 가입 코드 입력 (예: SAMSUNG24)
3. 서버: 코드 검증 → 기업 정보 반환
4. Step 2: 사용자 정보 입력
   - 이름, 이메일, 비밀번호
   - 부서: 기존 부서 선택 또는 "직접 입력"
   - 선호 언어: 한국어 / English
5. 서버: 회원 생성 → company_id 자동 할당
6. 리디렉션: /admin/login
```

### 권한 체크
```typescript
import { useAuth } from '@/features/auth/hooks/useAuth';

const { isSuperAdmin, isCompanyAdmin, hasRole } = useAuth();

// 슈퍼 관리자만
if (isSuperAdmin()) { ... }

// 복수 권한
if (hasRole(['super_admin', 'company_admin'])) { ... }
```

---

## 🐛 알려진 이슈

### 해결됨 ✅
- ~~라우트 그룹 `(superadmin)` 404 오류~~ → `superadmin` 일반 폴더로 변경
- ~~로그인 후 역할 무시 리디렉션~~ → 역할별 경로 분기 수정
- ~~LoginForm import 경로 오류~~ → CSS 경로 수정

### 진행 중 🔄
1. **API 연동 대기**: 현재 Mock 데이터 사용 중
2. **WebSocket 미구현**: 실시간 스트리밍 구조만 준비
3. **IndexedDB 미연결**: 북마크/세션 저장 미구현

---

## 📊 요구사항 충족도

### 기능 요구사항 (FR)
- **완료**: 24개 / 32개 (75%)
- **진행중**: 2개 / 32개 (6%)
- **미구현**: 6개 / 32개 (19%)

### 비기능 요구사항 (NFR)
- **완료**: 5개 / 11개 (45%)
- **진행중**: 2개 / 11개 (18%)
- **미구현**: 4개 / 11개 (37%)

### **프론트엔드 완성도: 약 75%** ⬆️
### **전체 시스템 완성도: 약 55%** ⬆️ (백엔드 연동 대기)

---

## 🎯 다음 작업 (우선순위)

### Immediate (이번 주)
1. ✅ ~~슈퍼 관리자 대시보드~~
2. ✅ ~~기업 관리 페이지 (가입 코드)~~
3. ✅ ~~사용자 관리 페이지~~
4. ✅ ~~시스템 설정 페이지~~
5. ✅ ~~회원가입 시스템~~
6. 📝 프로필 수정 (직책 입력)
7. 📝 로딩 스켈레톤 UI
8. 📝 토스트 알림 시스템

### This Month
9. 피드백 시스템
10. 북마크 기능
11. 요청사항 관리
12. 백엔드 API 연동 시작

---

## 📞 문의

프로젝트 관련 문의: P&DF 팀

---

**Last Updated**: 2025년 10월 21일

**Current Sprint**: 슈퍼 관리자 기능 완성 ✅

---

## 🔗 참고 문서

- [Next.js 14 Documentation](https://nextjs.org/docs)
- [요구사항 정의서](https://www.hancomdocs.com/open?fileId=eGzPDScXbTnPiGbQyKmGh7DOiHcZiLvT)
- [프로젝트 기획서](https://www.hancomdocs.com/open?fileId=iHcXbMd8zMuKiKmIbPF5B2h5E1p8l9F8)