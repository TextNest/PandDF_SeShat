import { useEffect, useRef } from 'react';
import { Object3D } from 'three';

/**
 * 3D 객체의 터치 기반 회전을 관리하는 커스텀 훅.
 * @param objectRef - 회전시킬 Three.js 객체의 ref.
 * @param isEnabled - 훅의 활성화 여부.
 */
export function useObjectRotation(
  objectRef: React.RefObject<Object3D | null>,
  isEnabled: boolean
) {
  const isRotatingRef = useRef(false); // 현재 회전 중인지 여부를 저장
  const didDragRef = useRef(false); // 드래그 동작이 있었는지 여부를 저장
  const touchStartXRef = useRef(0); // 터치 시작 지점의 X 좌표
  const startRotationRef = useRef({ y: 0 }); // 회전 시작 시의 객체 회전 값

  useEffect(() => {
    const handleRotationStart = (e: TouchEvent) => {
      if (e.touches.length !== 1 || !objectRef.current) return;

      const target = e.target as HTMLElement;
      if (target.closest('[style*="pointer-events: auto"]')) {
        return;
      }
      
      isRotatingRef.current = true;
      didDragRef.current = false; // 드래그 상태 초기화
      touchStartXRef.current = e.touches[0].clientX;
      startRotationRef.current = { y: objectRef.current.rotation.y };
    };

    const handleRotationMove = (e: TouchEvent) => {
      if (!isRotatingRef.current || e.touches.length !== 1 || !objectRef.current) return;

      const deltaX = e.touches[0].clientX - touchStartXRef.current;

      // 작은 움직임은 드래그로 간주하지 않음 (탭으로 처리될 수 있도록)
      if (Math.abs(deltaX) < 5) {
        return;
      }

      didDragRef.current = true; // 드래그 발생으로 표시

      const rotationY = startRotationRef.current.y + (deltaX / window.innerWidth) * Math.PI;

      objectRef.current.rotation.y = rotationY;
    };

    const handleRotationEnd = () => {
      isRotatingRef.current = false;
    };

    if (isEnabled) {
      window.addEventListener('touchstart', handleRotationStart);
      window.addEventListener('touchmove', handleRotationMove);
      window.addEventListener('touchend', handleRotationEnd);
    }

    return () => {
      window.removeEventListener('touchstart', handleRotationStart);
      window.removeEventListener('touchmove', handleRotationMove);
      window.removeEventListener('touchend', handleRotationEnd);
    };
  }, [isEnabled, objectRef]);

  return { didDragRef }; // 드래그 발생 여부를 외부로 노출
}
