// /components/ARScene.tsx
// WebXR을 사용하여 AR 렌더링과 상호작용을 처리하는 핵심 컴포넌트입니다.
// Three.js를 직접 제어하고, 각종 커스텀 훅을 사용하여 기능별 로직을 통합합니다.

import { useEffect, useRef, useState, useCallback } from 'react';
import { Scene, PerspectiveCamera, WebGLRenderer, HemisphereLight, Mesh, RingGeometry, MeshBasicMaterial, Vector3 } from 'three';
import { useObjectRotation } from '@/features/ar/hooks/useObjectRotation';
import { useMeasurement } from '@/features/ar/hooks/useMeasurement';
import { useFurniturePlacement } from '@/features/ar/hooks/useFurniturePlacement';
import styles from './ARScene.module.css';
import { COLORS } from '@/lib/ar/constants';
import { useARStore } from '@/store/useARStore';

interface ARSceneProps {
  uiOverlayRef: React.RefObject<HTMLDivElement | null>;
  lastUITouchTimeRef: React.RefObject<number>;
}

const ARScene: React.FC<ARSceneProps> = ({ uiOverlayRef, lastUITouchTimeRef }) => {
  // --- Zustand Store ---
  const {
    isARActive,
    setARActive,
    selectedFurniture,
    clearFurnitureCounter,
    clearMeasurementCounter,
    endARCounter,
    isPreviewing,
    selectFurniture,
    endAR,
    setDebugMessage,
  } = useARStore();

  // --- Refs & State ---
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const isPreviewingRef = useRef(false);

  const rendererRef = useRef<WebGLRenderer | null>(null);
  const sceneRef = useRef<Scene | null>(null);
  const hitTestSourceRef = useRef<XRHitTestSource | null>(null);
  const xrRefSpaceRef = useRef<XRReferenceSpace | null>(null);

  // --- Custom Hooks ---
  const measurement = useMeasurement(sceneRef);
  const furniture = useFurniturePlacement(sceneRef, selectFurniture, isARActive);
  const { didDragRef } = useObjectRotation(furniture.previewBoxRef, isPreviewing);

  useEffect(() => {
    isPreviewingRef.current = isPreviewing;
  }, [isPreviewing]);

  useEffect(() => {
    if (selectedFurniture) {
      furniture.createPreviewBox({
        width: selectedFurniture.width || 0.5,
        depth: selectedFurniture.depth || 0.5,
        height: selectedFurniture.height || 0.5,
      });
    } else {
      furniture.clearPreviewBox();
    }
  }, [selectedFurniture, furniture.createPreviewBox, furniture.clearPreviewBox]);

  useEffect(() => {
    if (clearFurnitureCounter > 0) {
      furniture.clearPlacedBoxes();
    }
  }, [clearFurnitureCounter, furniture]);

  useEffect(() => {
    if (clearMeasurementCounter > 0) {
      measurement.clearPoints();
    }
  }, [clearMeasurementCounter, measurement]);

  const handleEndAR = useCallback(() => {
    setDebugMessage('handleEndAR called');
    setARActive(false);
    setIsScanning(false);
    const session = rendererRef.current?.xr.getSession();
    if (session) {
      setDebugMessage('session found, calling session.end()');
      session.onselect = null;
      session.end();
    } else {
      setDebugMessage('session not found');
    }
    if (containerRef.current) containerRef.current.innerHTML = '';
    measurement.clearPoints();
    furniture.clearPlacedBoxes();
  }, [setARActive, measurement, furniture, setDebugMessage]);

  useEffect(() => {
    if (endARCounter > 0) {
      handleEndAR();
    }
  }, [endARCounter, handleEndAR]);

  const startAR = useCallback(async () => {
    if (!('xr' in navigator)) {
      alert('WebXR을 지원하지 않는 브라우저입니다.');
      return;
    }

    try {
      const session = await (navigator as any).xr.requestSession('immersive-ar', {
        optionalFeatures: ['hit-test', 'local-floor', 'dom-overlay'],
        domOverlay: { root: uiOverlayRef.current! },
      });

      setARActive(true);
      setIsScanning(true);

      const scene = new Scene();
      sceneRef.current = scene;
      const camera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);
      const renderer = new WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.xr.enabled = true;
      const light = new HemisphereLight(0xffffff, 0xbbbbff, 1);
      scene.add(light);

      const reticle = new Mesh(
        new RingGeometry(0.06, 0.08, 32),
        new MeshBasicMaterial({ color: COLORS.RETICLE })
      );
      reticle.rotation.x = -Math.PI / 2;
      reticle.visible = false;
      scene.add(reticle);

      const container = containerRef.current!;
      container.innerHTML = '';
      container.appendChild(renderer.domElement);
      rendererRef.current = renderer;
      await renderer.xr.setSession(session);

      xrRefSpaceRef.current = await session.requestReferenceSpace('local-floor');

      try {
        const viewerSpace = await session.requestReferenceSpace('viewer');
        hitTestSourceRef.current = await (session as any).requestHitTestSource({ space: viewerSpace });
      } catch (e) {
        console.error("히트 테스트 소스 생성 실패:", e);
        alert('히트 테스트를 시작할 수 없습니다.');
      }

      session.onselect = () => {
        const now = Date.now();
        if (now - lastUITouchTimeRef.current < 100) return;
        if (didDragRef.current) return;

        if (isPreviewingRef.current) {
          furniture.placeFurniture();
          return;
        }

        if (reticle.visible) {
          measurement.handleMeasurementSelect(reticle.position);
          return;
        }
      };

      const onXRFrame = (time: number, frame: XRFrame) => {
        if (!frame) return;
        const pose = frame.getViewerPose(xrRefSpaceRef.current!);
        if (!pose) return;

        let reticlePosition: Vector3 | null = null;
        if (hitTestSourceRef.current) {
          const hitTestResults = frame.getHitTestResults(hitTestSourceRef.current);
          if (hitTestResults.length > 0) {
            setIsScanning(false);
            const hit = hitTestResults[0];
            const hitPose = hit.getPose(xrRefSpaceRef.current!);
            if(hitPose) {
              reticle.visible = true;
              reticle.position.set(hitPose.transform.position.x, hitPose.transform.position.y, hitPose.transform.position.z);
              reticlePosition = reticle.position;
            }
          } else {
            reticle.visible = false;
          }
        }
        
        measurement.update(camera);
        furniture.update(reticlePosition);

        renderer.render(scene, camera);
      };
      renderer.setAnimationLoop(onXRFrame);
    } catch (err) {
      console.error('AR 세션 시작 중 오류 발생:', err);
      alert('AR 세션을 시작하지 못했습니다: ' + (err as Error).message);
    }
  }, [setARActive, uiOverlayRef, lastUITouchTimeRef, didDragRef, furniture, measurement]);

  useEffect(() => {
    return () => {
      if (rendererRef.current) {
        try { rendererRef.current.dispose?.() } catch {}
        rendererRef.current = null;
      }
      measurement.clearPoints();
      furniture.clearPlacedBoxes();
    };
  }, [measurement, furniture]);

  return (
    <>
      <div 
        ref={containerRef} 
        className={`${styles.arContainer} ${isARActive ? styles.arContainerActive : styles.arContainerInactive}`}
      />
      {!isARActive ? (
        <div className={styles.centerContainer}>
          <button onClick={startAR} className={styles.startButton}>AR 시작</button>
        </div>
      ) : (
        isScanning && (
          <div className={`${styles.centerContainer} ${styles.scanMessage}`}>
            <span>표면을 찾기 위해 휴대폰을 움직여주세요...</span>
          </div>
        )
      )}
    </>
  );
};

export default ARScene;
