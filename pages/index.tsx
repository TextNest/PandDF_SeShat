import { useEffect, useRef, useState } from 'react';
import { usePanelInteraction } from '../hooks/usePanelInteraction';
import { FurnitureItem } from '../lib/types';
import ARScene, { ARSceneHandles } from '../components/ARScene';
import styles from './Home.module.css';

export default function Home() {
  // --- 참조(Refs) ---
  const uiOverlayRef = useRef<HTMLDivElement | null>(null);
  const arSceneRef = useRef<ARSceneHandles | null>(null);
  const lastUITouchTimeRef = useRef(0);

  // --- UI 훅 & 상태 ---
  const { panelRef, panelStyle, handleInteractionStart } = usePanelInteraction(lastUITouchTimeRef);
  const [dbItems, setDbItems] = useState<FurnitureItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<FurnitureItem | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
  const [isARActive, setARActive] = useState(false);
  
  // --- 데이터 가져오기 ---
  useEffect(() => {
    async function fetchDbItems() {
      try {
        const response = await fetch('/api/users');
        if (!response.ok) {
          throw new Error(`HTTP 오류! 상태: ${response.status}`);
        }
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
    const item = dbItems.find(i => i.id.toString() === itemId);
    setSelectedItem(item || null);
    setIsDropdownOpen(false);

    if (item) {
      arSceneRef.current?.furniture.createPreviewBox({
        width: item.width || 0.5,
        depth: item.depth || 0.5,
        height: item.height || 0.5,
      });
    } else {
      arSceneRef.current?.furniture.clearPreviewBox();
    }
  };

  const handleClearFurniture = () => {
    arSceneRef.current?.furniture.clearPlacedBoxes();
  };

  const handleClearMeasurement = () => {
    arSceneRef.current?.measurement.clearPoints();
  };

  const handleEndAR = () => {
    arSceneRef.current?.endAR();
  };

  return (
    <div className={styles.container}>
      <ARScene 
        ref={arSceneRef} 
        uiOverlayRef={uiOverlayRef} 
        lastUITouchTimeRef={lastUITouchTimeRef}
        onSessionStart={() => setARActive(true)}
        onSessionEnd={() => setARActive(false)}
      />
      
      <div ref={uiOverlayRef} className={styles.uiOverlay}>
        {isARActive && (
          <div
            ref={panelRef}
            onMouseDown={handleInteractionStart as any}
            onTouchStart={handleInteractionStart as any}
            style={panelStyle} // panelStyle은 동적이므로 style 속성으로 유지
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
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className={styles.dropdownButton}
                    >
                      {selectedItem ? `${selectedItem.name} (W:${selectedItem.width}, D:${selectedItem.depth}, H:${selectedItem.height})` : '-- 아이템 선택 --'}
                    </button>
                    {isDropdownOpen && (
                      <div className={styles.dropdownMenu}>
                        <button
                          onClick={() => handleSelectItem('')}
                          className={styles.dropdownItem}
                        >
                          -- 아이템 선택 --
                        </button>
                        {dbItems.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => handleSelectItem(item.id.toString())}
                            className={`${styles.dropdownItem} ${selectedItem?.id === item.id ? styles.dropdownItemSelected : ''}`}
                          >
                            {item.name} (W:{item.width}, D:{item.depth}, H:{item.height})
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className={styles.buttonGrid}>
                  <button onClick={handleClearFurniture} className={`${styles.button} ${styles.buttonSecondary}`}>가구 삭제</button>
                  <button onClick={handleClearMeasurement} className={`${styles.button} ${styles.buttonSecondary}`}>측정 삭제</button>
                </div>
                <button onClick={handleEndAR} className={`${styles.button} ${styles.buttonDanger}`}>AR 종료</button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
