// ============================================
// 📄 1. src/app/layout.tsx
// ============================================
// 루트 레이아웃 - 모든 페이지에 적용되는 최상위 레이아웃
// ============================================

import type { Metadata } from 'next';
import '@/styles/globals.css';
import '@/styles/typography.css';
import '@/styles/utilities.css';

export const metadata: Metadata = {
  title: 'SeShat - AI 제품 설명서 어시스턴트',
  description: 'LLM 기반 전자제품 설명서 질의응답 시스템',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
