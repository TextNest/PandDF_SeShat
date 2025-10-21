import { useState, useRef, useCallback } from 'react';
import { Scene, Mesh, Material, BoxGeometry, MeshStandardMaterial, Vector3 } from 'three';

/**
 * AR 환경에서 가구를 미리보고, 배치하고, 제거하는 로직을 관리하는 커스텀 훅.
 * @param sceneRef - 3D 객체들을 추가하거나 제거할 Scene의 ref.
 * @param sessionActive - AR 세션의 활성화 여부.
 */
export function useFurniturePlacement(sceneRef: React.RefObject<Scene | null>, sessionActive: boolean) {
    const [isPreviewing, setIsPreviewing] = useState(false);
    const previewBoxRef = useRef<Mesh | null>(null);
    const placedBoxesRef = useRef<Mesh[]>([]);

    const clearPreviewBox = useCallback(() => {
        if (previewBoxRef.current) {
            sceneRef.current?.remove(previewBoxRef.current);
            previewBoxRef.current.geometry.dispose();
            (previewBoxRef.current.material as Material).dispose();
            previewBoxRef.current = null;
            setIsPreviewing(false);
        }
    }, [sceneRef]);

    /**
     * 미리보기 가구를 생성합니다.
     */
    const createPreviewBox = useCallback((dimensions: { width: number; height: number; depth: number }) => {
        if (!sessionActive || !sceneRef.current) {
            alert("AR 세션을 먼저 시작해주세요.");
            return;
        }
        // 기존 미리보기 박스가 있다면 제거 (새로운 박스를 생성하기 전에)
        clearPreviewBox();

        const { width, height, depth } = dimensions;
        const geometry = new BoxGeometry(width || 0, height || 0, depth || 0);
        const material = new MeshStandardMaterial({ color: 0x00ff00, transparent: true, opacity: 0.5 });
        const box = new Mesh(geometry, material);
        box.visible = false;
        previewBoxRef.current = box;
        sceneRef.current.add(box);
        setIsPreviewing(true);
    }, [sessionActive, sceneRef, clearPreviewBox]);

    /**
     * 미리보기 중인 가구를 현재 위치에 실제로 배치합니다.
     */
    const placeFurniture = useCallback(() => {
        if (!previewBoxRef.current || !sceneRef.current) return;

        const geometry = previewBoxRef.current.geometry.clone();
        const material = new MeshStandardMaterial({ color: 0x0000ff });
        const box = new Mesh(geometry, material);
        box.position.copy(previewBoxRef.current.position);
        box.rotation.copy(previewBoxRef.current.rotation);
        sceneRef.current.add(box);
        placedBoxesRef.current.push(box);

        sceneRef.current.remove(previewBoxRef.current);
        previewBoxRef.current.geometry.dispose();
        (previewBoxRef.current.material as Material).dispose();
        previewBoxRef.current = null;
        setIsPreviewing(false);
    }, [sceneRef]);

    /**
     * 배치된 모든 가구를 씬에서 제거합니다.
     */
    const clearPlacedBoxes = useCallback(() => {
        if (!sceneRef.current) return;
        placedBoxesRef.current.forEach(box => {
            sceneRef.current?.remove(box);
            box.geometry.dispose();
            (box.material as Material).dispose();
        });
        placedBoxesRef.current = [];
    }, [sceneRef]);

    /**
     * 매 프레임 호출되어 미리보기 객체의 상태를 업데이트합니다.
     * @param reticlePosition - 현재 AR 표면에 감지된 위치.
     */
    const update = (reticlePosition: Vector3 | null) => {
        if (previewBoxRef.current) {
            if (reticlePosition) {
                previewBoxRef.current.position.copy(reticlePosition);
                previewBoxRef.current.visible = true;
            } else {
                previewBoxRef.current.visible = false;
            }
        }
    };

    return {
        isPreviewing,
        previewBoxRef, // 회전 훅에서 사용하기 위해 노출
        createPreviewBox,
        placeFurniture,
        clearPlacedBoxes,
        clearPreviewBox,
        update,
    };
}
