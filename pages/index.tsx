// /pages/index.tsx
// 이 파일은 애플리케이션의 메인 페이지(진입점)입니다.
// AR 씬과 모든 UI 요소를 렌더링하고 관리합니다.

import { useEffect, useRef, useState } from 'react';
import { usePanelInteraction } from '../hooks/usePanelInteraction';
import { FurnitureItem } from '../lib/types';
import ARScene from '../components/ARScene';
import styles from './Home.module.css';
import { useStore } from '../store/store';
import { shallow } from 'zustand/shallow';

export default function Home() {
  // --- Zustand Store ---
  const isARActive = useStore((state) => state.isARActive);
  const selectedFurniture = useStore((state) => state.selectedFurniture);
  const selectFurniture = useStore((state) => state.selectFurniture);
  const triggerClearFurniture = useStore((state) => state.triggerClearFurniture);
  const triggerClearMeasurement = useStore((state) => state.triggerClearMeasurement);
  const triggerEndAR = useStore((state) => state.triggerEndAR);

  // --- 참조(Refs) ---
  const uiOverlayRef = useRef<HTMLDivElement | null>(null);
  const lastUITouchTimeRef = useRef(0);

  // --- UI 훅 & 로컬 상태 ---
  const { panelRef, panelStyle, handleInteractionStart } = usePanelInteraction(lastUITouchTimeRef);
  const [dbItems, setDbItems] = useState<FurnitureItem[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);

  // --- 데이터 가져오기 ---
  useEffect(() => {
    async function fetchDbItems() {
      try {
        const response = await fetch('/api/furniture');
        if (!response.ok) throw new Error(`HTTP 오류! 상태: ${response.status}`);
        const data = await response.json();
        if (Array.isArray(data)) {
          setDbItems(data);
        } else {
          console.error("API 응답이 배열이 아닙니다:", data);
          setDbItems([]);
        }
      } catch (error) {
        console.error("DB 아이템 가져오기 실패:", error);
      }
    }
    fetchDbItems();
  }, []);

  // --- 이벤트 핸들러 ---
  const handleSelectItem = (itemId: string) => {
    const item = dbItems.find((i) => i.id.toString() === itemId);
    selectFurniture(item || null);
    setIsDropdownOpen(false);
  };

  const handleClearFurniture = () => {
    triggerClearFurniture();
  };

  const handleClearMeasurement = () => {
    triggerClearMeasurement();
  };

  const handleEndAR = () => {
    triggerEndAR();
  };

  return (
    <div className={styles.container}>
      <ARScene uiOverlayRef={uiOverlayRef} lastUITouchTimeRef={lastUITouchTimeRef} />

      <div ref={uiOverlayRef} className={styles.uiOverlay}>
        {isARActive && (
          <div
            ref={panelRef}
            onMouseDown={handleInteractionStart}
            onTouchStart={handleInteractionStart}
            style={panelStyle}
            className={styles.panel}
          >
            <div className={`${styles.panelHeader} ${isPanelCollapsed ? styles.panelHeaderCollapsed : ''}`}>
              <div className={styles.panelTitle}>메뉴</div>
              <button onClick={() => setIsPanelCollapsed(!isPanelCollapsed)} className={styles.headerButton}>
                {isPanelCollapsed ? '▼' : '▲'}
              </button>
            </div>
            {!isPanelCollapsed && (
              <>
                <h2 className={styles.sectionTitle}>가구 배치(m)</h2>
                <div className={styles.section}>
                  <h3 className={styles.subSectionTitle}>DB 아이템 선택 ({dbItems.length}개)</h3>
                  <div className={styles.dropdownContainer}>
                    <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className={styles.dropdownButton}>
                      {selectedFurniture
                        ? `${selectedFurniture.name} (W:${selectedFurniture.width}, D:${selectedFurniture.depth}, H:${selectedFurniture.height})`
                        : '-- 아이템 선택 --'}
                    </button>
                    {isDropdownOpen && (
                      <div className={styles.dropdownMenu}>
                        <button onClick={() => handleSelectItem('')} className={styles.dropdownItem}>
                          -- 아이템 선택 --
                        </button>
                        {dbItems.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => handleSelectItem(item.id.toString())}
                            className={`${styles.dropdownItem} ${selectedFurniture?.id === item.id ? styles.dropdownItemSelected : ''}`}>
                            {item.name} (W:{item.width}, D:{item.depth}, H:{item.height})
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className={styles.buttonGrid}>
                  <button onClick={handleClearFurniture} className={`${styles.button} ${styles.buttonSecondary}`}>
                    가구 삭제
                  </button>
                  <button onClick={handleClearMeasurement} className={`${styles.button} ${styles.buttonSecondary}`}>
                    측정 삭제
                  </button>
                </div>
                <button onClick={handleEndAR} className={`${styles.button} ${styles.buttonDanger}`}>
                  AR 종료
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}