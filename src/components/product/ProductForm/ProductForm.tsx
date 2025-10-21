// ============================================
// 📄 3. src/components/product/ProductForm/ProductForm.tsx
// ============================================
// 제품 생성/수정 폼
// ============================================

'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button/Button';
import Input from '@/components/ui/Input/Input';
import styles from './ProductForm.module.css';

interface ProductFormProps {
  initialData?: {
    name: string;
    model: string;
    category: string;
    description?: string;
  };
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export default function ProductForm({ initialData, onSubmit, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    model: initialData?.model || '',
    category: initialData?.category || '가전',
    description: initialData?.description || '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.model) {
      alert('필수 항목을 입력해주세요.');
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <Input
        label="제품명"
        placeholder="예: 세탁기"
        value={formData.name}
        onChange={(e) => handleChange('name', e.target.value)}
        required
        fullWidth
      />

      <Input
        label="모델명"
        placeholder="예: WM-2024"
        value={formData.model}
        onChange={(e) => handleChange('model', e.target.value)}
        required
        fullWidth
      />

      <div className={styles.field}>
        <label className={styles.label}>
          카테고리 <span className={styles.required}>*</span>
        </label>
        <select
          className={styles.select}
          value={formData.category}
          onChange={(e) => handleChange('category', e.target.value)}
        >
          <option value="가전">가전</option>
          <option value="전자기기">전자기기</option>
          <option value="주방기기">주방기기</option>
          <option value="생활가전">생활가전</option>
          <option value="기타">기타</option>
        </select>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>설명 (선택사항)</label>
        <textarea
          className={styles.textarea}
          placeholder="제품 설명을 입력하세요"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={4}
        />
      </div>

      <div className={styles.actions}>
        <Button type="button" variant="outline" onClick={onCancel}>
          취소
        </Button>
        <Button type="submit" variant="primary">
          저장
        </Button>
      </div>
    </form>
  );
}