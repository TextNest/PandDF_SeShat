// ============================================
// 📄 7. src/app/(admin)/products/[id]/page.tsx
// ============================================
// 제품 상세 페이지
// ============================================

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import Button from '@/components/ui/Button/Button';
import Modal from '@/components/ui/Modal/Modal';
import ProductQRCode from '@/components/product/ProductQRCode/ProductQRCode';
import ProductForm from '@/components/product/ProductForm/ProductForm';
import { Product } from '@/types/product.types';
import { formatRelativeTime } from '@/lib/utils/format';
import styles from './products-page.module.css';

// 임시 데이터
const mockProduct: Product = {
  id: '1',
  name: '세탁기',
  model: 'WM-2024',
  category: '가전',
  description: '드럼 세탁기로 대용량 세탁이 가능하며 에너지 효율이 높습니다.',
  qrCodeUrl: '/qr-codes/WM-2024.png',
  documentName: '세탁기_WM-2024.pdf',
  documentId: 'doc-1',
  status: 'active',
  createdAt: new Date('2025-01-10'),
  updatedAt: new Date('2025-01-15'),
};

export default function ProductDetailPage() {
  const router = useRouter();
  const [product] = useState<Product>(mockProduct);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleUpdate = (data: any) => {
    console.log('Update product:', data);
    // TODO: API 연동
    setIsEditModalOpen(false);
  };

  const handleDelete = () => {
    if (confirm('정말 삭제하시겠습니까?')) {
      // TODO: API 연동
      router.push('/products');
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => router.back()}>
          <ArrowLeft size={20} />
          뒤로 가기
        </button>
        
        <div className={styles.headerActions}>
          <Button variant="outline" onClick={() => setIsEditModalOpen(true)}>
            <Edit size={18} />
            수정
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            <Trash2 size={18} />
            삭제
          </Button>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.infoSection}>
          <div className={styles.productHeader}>
            <h1 className={styles.productName}>{product.name}</h1>
            <span className={`${styles.status} ${styles[product.status]}`}>
              {product.status === 'active' ? '활성' : '비활성'}
            </span>
          </div>

          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>모델명</span>
              <span className={styles.infoValue}>{product.model}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>카테고리</span>
              <span className={styles.infoValue}>{product.category}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>등록일</span>
              <span className={styles.infoValue}>
                {formatRelativeTime(product.createdAt)}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>최종 수정</span>
              <span className={styles.infoValue}>
                {formatRelativeTime(product.updatedAt)}
              </span>
            </div>
          </div>

          {product.description && (
            <div className={styles.description}>
              <h3>제품 설명</h3>
              <p>{product.description}</p>
            </div>
          )}

          {product.documentName && (
            <div className={styles.document}>
              <h3>연결된 문서</h3>
              <div className={styles.documentCard}>
                <span>{product.documentName}</span>
                <Button variant="outline" size="sm">
                  문서 보기
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className={styles.qrSection}>
          <h2 className={styles.sectionTitle}>QR 코드</h2>
          <ProductQRCode productId={product.id} productName={product.name} />
        </div>
      </div>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="제품 수정"
        size="md"
      >
        <ProductForm
          initialData={{
            name: product.name,
            model: product.model,
            category: product.category,
            description: product.description,
          }}
          onSubmit={handleUpdate}
          onCancel={() => setIsEditModalOpen(false)}
        />
      </Modal>
    </div>
  );
}