// ============================================
// 📄 6. src/components/product/ProductCard/ProductCard.tsx
// ============================================
// 제품 카드 컴포넌트
// ============================================

import Link from 'next/link';
import { Package, QrCode, FileText, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { Product } from '@/types/product.types';
import { formatRelativeTime } from '@/lib/utils/format';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const handleDownloadQR = () => {
    // TODO: QR 코드 다운로드
    alert(`QR 코드 다운로드: ${product.model}`);
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.iconWrapper}>
          <Package size={32} />
        </div>
        <button className={styles.menuButton}>
          <MoreVertical size={20} />
        </button>
      </div>

      <div className={styles.content}>
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.model}>{product.model}</p>
        {product.description && (
          <p className={styles.description}>{product.description}</p>
        )}
      </div>

      <div className={styles.meta}>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>카테고리</span>
          <span className={styles.metaValue}>{product.category}</span>
        </div>
        {product.documentName && (
          <div className={styles.metaItem}>
            <FileText size={14} />
            <span className={styles.metaValue}>{product.documentName}</span>
          </div>
        )}
      </div>

      <div className={styles.footer}>
        <span className={`${styles.status} ${styles[product.status]}`}>
          {product.status === 'active' ? '활성' : '비활성'}
        </span>
        <span className={styles.date}>
          {formatRelativeTime(product.updatedAt)}
        </span>
      </div>

      <div className={styles.actions}>
        {product.qrCodeUrl && (
          <button 
            className={styles.qrButton}
            onClick={handleDownloadQR}
            title="QR 코드 다운로드"
          >
            <QrCode size={16} />
            QR
          </button>
        )}
        <Link href={`/products/${product.id}`} className={styles.actionButton}>
          <Edit size={16} />
        </Link>
        <button className={`${styles.actionButton} ${styles.danger}`}>
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}