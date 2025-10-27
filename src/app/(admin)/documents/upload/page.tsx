// ============================================
// 📄 8. src/app/(admin)/documents/upload/page.tsx
// ============================================
// 문서 업로드 페이지 (고도화)
// ============================================

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DocumentUploader from '@/components/document/DocumentUploader/DocumentUploader';
import Button from '@/components/ui/Button/Button';
import Input from '@/components/ui/Input/Input';
import styles from './upload-page.module.css';

export default function DocumentUploadPage() {
  const router = useRouter();
  const [productName, setProductName] = useState('');
  const [productId, setProductId] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile || !productName) {
      alert('필수 항목을 입력해주세요.');
      return;
    }

    setIsUploading(true);

    // TODO: 실제 API 연동
    setTimeout(() => {
      setIsUploading(false);
      alert('업로드 완료!');
      router.push('/documents');
    }, 2000);
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>문서 업로드</h1>
        <p className={styles.subtitle}>새로운 PDF 문서를 업로드하세요</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <DocumentUploader onFileSelect={handleFileSelect} />

        <div className={styles.fields}>
          <Input
            label="제품명"
            placeholder="예: 세탁기 WM-2024"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
            fullWidth
          />

          <Input
            label="제품 ID (선택사항)"
            placeholder="예: WM-2024"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            fullWidth
            helperText="제품 ID를 입력하면 해당 제품과 연결됩니다"
          />
        </div>

        <div className={styles.actions}>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            취소
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={isUploading}
            disabled={!selectedFile || !productName}
          >
            업로드
          </Button>
        </div>
      </form>
    </div>
  );
}
