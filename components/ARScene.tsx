import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { Scene, PerspectiveCamera, WebGLRenderer, HemisphereLight, Mesh, RingGeometry, MeshBasicMaterial, Vector3 } from 'three';
import { useObjectRotation } from '../hooks/useObjectRotation';
import { useMeasurement } from '../hooks/useMeasurement';
import { useFurniturePlacement } from '../hooks/useFurniturePlacement';
import styles from './ARScene.module.css';

// 부모 컴포넌트에서 호출 가능한 함수들
export interface ARSceneHandles {
  startAR: () => Promise<void>;
  endAR: () => void;
  measurement: ReturnType<typeof useMeasurement>;
  furniture: ReturnType<typeof useFurniturePlacement>;
}

interface ARSceneProps {
  uiOverlayRef: React.RefObject<HTMLDivElement | null>;
  lastUITouchTimeRef: React.RefObject<number>;
  onSessionStart: () => void;
  onSessionEnd: () => void;
}

const ARScene = forwardRef<ARSceneHandles, ARSceneProps>(({ uiOverlayRef, lastUITouchTimeRef, onSessionStart, onSessionEnd }, ref) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [sessionActive, setSessionActive] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const isPreviewingRef = useRef(false);

  const rendererRef = useRef<any>(null);
  const sceneRef = useRef<Scene | null>(null);
  const hitTestSourceRef = useRef<any>(null);
  const xrRefSpaceRef = useRef<any>(null);

  const measurement = useMeasurement(sceneRef, sessionActive);
  const furniture = useFurniturePlacement(sceneRef, sessionActive);
  const { didDragRef } = useObjectRotation(furniture.previewBoxRef, furniture.isPreviewing);

  useEffect(() => {
    isPreviewingRef.current = furniture.isPreviewing;
  }, [furniture.isPreviewing]);

  useEffect(() => {
    return () => {
      if (rendererRef.current) {
        try { rendererRef.current.dispose?.() } catch {}
        rendererRef.current = null;
      }
      measurement.clearPoints();
      furniture.clearPlacedBoxes();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function startAR() {
    if (!('xr' in navigator)) {
      alert('WebXR을 지원하지 않는 브라우저입니다.');
      return;
    }

    try {
      const session = await (navigator as any).xr.requestSession('immersive-ar', {
        optionalFeatures: ['hit-test', 'local-floor', 'dom-overlay'],
        domOverlay: { root: uiOverlayRef.current! }
      });

      onSessionStart();
      setSessionActive(true);
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
        new MeshBasicMaterial({ color: 0x00ff00 })
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

        // 드래그(회전) 동작이었다면 가구 배치를 막습니다.
        if (didDragRef.current) {
          return;
        }

        if (isPreviewingRef.current) {
          furniture.placeFurniture();
          return;
        }

        if (reticle.visible) {
          measurement.handleMeasurementSelect(reticle.position);
          return;
        }
      };

      const onXRFrame = (time: any, frame: any) => {
        if (!frame) return;
        const pose = frame.getViewerPose(xrRefSpaceRef.current);
        if (!pose) return;

        let reticlePosition: Vector3 | null = null;
        if (hitTestSourceRef.current) {
          const hitTestResults = frame.getHitTestResults(hitTestSourceRef.current);
          if (hitTestResults.length > 0) {
            setIsScanning(false);
            const hit = hitTestResults[0];
            const hitPose = hit.getPose(xrRefSpaceRef.current);
            reticle.visible = true;
            reticle.position.set(hitPose.transform.position.x, hitPose.transform.position.y, hitPose.transform.position.z);
            reticlePosition = reticle.position;
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
  }

  function endAR() {
    onSessionEnd();
    setSessionActive(false);
    setIsScanning(false);
    const session = rendererRef.current?.xr.getSession();
    if (session) {
      session.onselect = null;
      session.end();
    }
    if (containerRef.current) containerRef.current.innerHTML = '';
    measurement.clearPoints();
    furniture.clearPlacedBoxes();
  }

  useImperativeHandle(ref, () => ({
    startAR,
    endAR,
    measurement,
    furniture,
  }));

  return (
    <>
      <div 
        ref={containerRef} 
        className={`${styles.arContainer} ${sessionActive ? styles.arContainerActive : styles.arContainerInactive}`}
      />
      {!sessionActive ? (
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
});

ARScene.displayName = 'ARScene';
export default ARScene;