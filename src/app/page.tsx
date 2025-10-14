// ============================================
// 📄 2. src/app/page.tsx
// ============================================
// 홈페이지 (/)
// ============================================

export default function HomePage() {
  return (
    <main className="container" style={{ padding: '2rem' }}>
      <h1>SeShat</h1>
      <p className="text-secondary">AI 기반 제품 설명서 질의응답 시스템</p>
      
      <div style={{ marginTop: '2rem' }}>
        <a href="/dashboard" style={{ 
          display: 'inline-block',
          padding: '0.75rem 1.5rem',
          backgroundColor: 'var(--color-primary)',
          color: 'white',
          borderRadius: 'var(--border-radius-md)',
          marginRight: '1rem'
        }}>
          관리자 대시보드
        </a>
        
        <a href="/chat/sample-product" style={{ 
          display: 'inline-block',
          padding: '0.75rem 1.5rem',
          backgroundColor: 'var(--color-secondary)',
          color: 'white',
          borderRadius: 'var(--border-radius-md)'
        }}>
          챗봇 체험하기
        </a>
      </div>
    </main>
  );
}