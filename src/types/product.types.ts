// ============================================
// 📄 1. src/types/product.types.ts
// ============================================
// 제품 관련 타입 정의
// ============================================

export interface Product {
  id: string;
  name: string;
  model: string;
  category: string;
  description?: string;
  imageUrl?: string;
  qrCodeUrl?: string;
  documentId?: string;
  documentName?: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductCreateRequest {
  name: string;
  model: string;
  category: string;
  description?: string;
  documentId?: string;
}