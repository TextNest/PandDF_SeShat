// ============================================
// 📄 7. src/app/(admin)/products/page.tsx
// ============================================
// 제품 관리 페이지
// ============================================

export default function ProductsPage() {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-xl)' }}>
        <div>
          <h1>제품 관리</h1>
          <p className="text-secondary">제품과 QR 코드를 관리하세요</p>
        </div>
        <button style={{
          padding: 'var(--spacing-md) var(--spacing-lg)',
          backgroundColor: 'var(--color-primary)',
          color: 'white',
          borderRadius: 'var(--border-radius-md)',
          fontWeight: 'var(--font-weight-medium)',
          cursor: 'pointer'
        }}>
          + 제품 추가
        </button>
      </div>
      
      <div className="card">
        <p className="text-secondary" style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
          등록된 제품이 없습니다
        </p>
      </div>
    </div>
  );
}