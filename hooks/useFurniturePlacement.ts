import { useRef, useCallback } from 'react';
import { Scene, Mesh, Material, BoxGeometry, MeshStandardMaterial, Vector3 } from 'three';
import { COLORS } from '../lib/constants';
import { FurnitureItem } from '../lib/types';

// selectFurniture 액션의 타입을 정의합니다。
type SelectFurnitureAction = (furniture: FurnitureItem | null) => void;

/**
 * AR 환경에서 가구를 미리보고, 배치하고, 제거하는 로직을 관리하는 커스텀 훅.
 * 이 훅은 이제 store를 직접 구독하지 않고, 필요한 상태와 함수를 인자로 전달받습니다.
 * @param sceneRef - 3D 객체들을 추가하거나 제거할 Scene의 ref.
 * @param selectFurniture - 가구 선택을 해제하기 위한 store의 액션.
 * @param isARActive - AR 세션의 활성화 여부.
 */
export function useFurniturePlacement(
    sceneRef: React.RefObject<Scene | null>,
    selectFurniture: SelectFurnitureAction,
    isARActive: boolean
) {
    const previewBoxRef = useRef<Mesh | null>(null);
    const placedBoxesRef = useRef<Mesh[]>([]);

    const clearPreviewBox = useCallback(() => {
        if (previewBoxRef.current) {
            sceneRef.current?.remove(previewBoxRef.current);
            previewBoxRef.current.geometry.dispose();
            (previewBoxRef.current.material as Material).dispose();
            previewBoxRef.current = null;
        }
    }, [sceneRef]);

    const createPreviewBox = useCallback((dimensions: { width: number; height: number; depth: number }) => {
        if (!isARActive || !sceneRef.current) {
            alert("AR 세션을 먼저 시작해주세요.");
            return;
        }
        clearPreviewBox();

        const { width, height, depth } = dimensions;
        const geometry = new BoxGeometry(width || 0, height || 0, depth || 0);
        const material = new MeshStandardMaterial({ color: COLORS.FURNITURE_PREVIEW, transparent: true, opacity: 0.5 });
        const box = new Mesh(geometry, material);
        box.visible = false;
        previewBoxRef.current = box;
        sceneRef.current.add(box);
    }, [isARActive, sceneRef, clearPreviewBox]);

    const placeFurniture = useCallback(() => {
        if (!previewBoxRef.current || !sceneRef.current) return;

        const geometry = previewBoxRef.current.geometry.clone();
        const material = new MeshStandardMaterial({ color: COLORS.FURNITURE_PLACED });
        const box = new Mesh(geometry, material);
        
        box.position.copy(previewBoxRef.current.position);
        box.rotation.copy(previewBoxRef.current.rotation);
        
        sceneRef.current.add(box);
        placedBoxesRef.current.push(box);

        clearPreviewBox();

    }, [sceneRef, clearPreviewBox, selectFurniture]);

    const clearPlacedBoxes = useCallback(() => {
        if (!sceneRef.current) return;
        placedBoxesRef.current.forEach(box => {
            sceneRef.current?.remove(box);
            box.geometry.dispose();
            (box.material as Material).dispose();
        });
        placedBoxesRef.current = [];
    }, [sceneRef]);

    const update = useCallback((reticlePosition: Vector3 | null) => {
        if (previewBoxRef.current) {
            if (reticlePosition) {
                const boxHeight = (previewBoxRef.current.geometry as BoxGeometry).parameters.height;
                previewBoxRef.current.position.copy(reticlePosition);
                previewBoxRef.current.position.y += boxHeight / 2;
                previewBoxRef.current.visible = true;
            } else {
                previewBoxRef.current.visible = false;
            }
        }
    }, []);

    // 이 훅은 더 이상 isPreviewing 상태를 반환하지 않습니다.
    return {
        previewBoxRef,
        createPreviewBox,
        placeFurniture,
        clearPlacedBoxes,
        clearPreviewBox,
        update,
    };
}