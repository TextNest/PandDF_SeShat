'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { MessageSquare, QrCode, Sparkles, BookOpen, Clock, Shield } from 'lucide-react';
import { useEffect } from 'react';
import styles from './page.module.css';
import { toast } from '@/store/useToastStore';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  // 이미 로그인된 경우 자동 리디렉션
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'super_admin') {
        router.push('/superadmin');
      } else if (user.role === 'company_admin') {
        router.push('/dashboard');
      } else {
        router.push('/my');
      }
    }
  }, [isAuthenticated, user, router]);

  const handleGoogleLogin = () => {
    // TODO: 실제 Google OAuth 연동
    toast.info('구글 로그인 기능은 백엔드 연동 후 활성화됩니다.');
    // 실제: window.location.href = '/api/auth/google';
  };

  const handleAdminLogin = () => {
    router.push('/admin/login');
  };

  return (
    <div className={styles.page}>
      {/* 히어로 섹션 */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <div className={styles.circle1}></div>
          <div className={styles.circle2}></div>
        </div>

        <div className={styles.heroContent}>
          <div className={styles.logo}>
            <Sparkles size={48} className={styles.logoIcon} />
            <h1>SeShat</h1>
          </div>

          <p className={styles.tagline}>
            AI가 제품 설명서를 읽어드립니다
          </p>

          <p className={styles.description}>
            복잡한 설명서는 이제 그만! QR 코드를 스캔하고<br />
            AI 챗봇에게 궁금한 것을 물어보세요.
          </p>

          {/* CTA 버튼 */}
          <div className={styles.ctaButtons}>
            <button
              className={styles.primaryButton}
              onClick={handleGoogleLogin}
            >
              <svg className={styles.googleIcon} viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google로 시작하기
            </button>

            <button
              className={styles.secondaryButton}
              onClick={() => router.push('/')}
            >
              <QrCode size={20} />
              QR 코드 스캔하기
            </button>
          </div>

          {/* 안내 */}
          <p className={styles.hint}>
            💡 로그인 없이도 사용 가능하지만, 로그인하면 대화 기록이 저장됩니다
          </p>
        </div>
      </section>

      {/* 기능 소개 */}
      <section className={styles.features}>
        <div className={styles.featuresContainer}>
          <h2>주요 기능</h2>

          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <MessageSquare size={32} />
              </div>
              <h3>AI 챗봇 질문</h3>
              <p>복잡한 설명서 대신 AI에게 편하게 물어보세요</p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <QrCode size={32} />
              </div>
              <h3>QR 스캔 접속</h3>
              <p>제품의 QR 코드를 스캔하면 바로 연결됩니다</p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <BookOpen size={32} />
              </div>
              <h3>출처 표시</h3>
              <p>답변의 출처를 PDF 페이지와 함께 확인하세요</p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <Clock size={32} />
              </div>
              <h3>대화 기록 저장</h3>
              <p>로그인하면 과거 대화를 언제든 다시 볼 수 있어요</p>
            </div>
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p>© 2025 SeShat. All rights reserved.</p>
          <button
            className={styles.adminLink}
            onClick={handleAdminLogin}
          >
            <Shield size={16} />
            관리자 로그인
          </button>
        </div>
      </footer>
    </div>
  );
}