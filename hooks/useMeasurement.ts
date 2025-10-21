import { useState, useRef, useCallback } from 'react';
import { Scene, Vector3, Mesh, Sprite, Line, SphereGeometry, MeshStandardMaterial, Material, BufferGeometry, LineBasicMaterial, Camera } from 'three';
import { makeTextSprite } from '../lib/utils';

/**
 * AR 환경에서 두 지점 사이의 거리를 측정하는 로직을 관리하는 커스텀 훅.
 * @param sceneRef - 3D 객체들을 추가하거나 제거할 Scene의 ref.
 * @param sessionActive - AR 세션의 활성화 여부.
 */
export function useMeasurement(sceneRef: React.RefObject<Scene | null>, sessionActive: boolean) {
    const [distance, setDistance] = useState<number | null>(null);
    const pointsRef = useRef<Vector3[]>([]);
    const pointMeshesRef = useRef<Mesh[]>([]);
    const distanceSpriteRef = useRef<Sprite | null>(null);
    const lineRef = useRef<Line | null>(null);

    // 성능 최적화를 위해 측정 점의 모양(geometry)과 재질(material)을 미리 생성하여 재사용
    const pointGeometry = useRef(new SphereGeometry(0.03, 16, 16)).current;
    const pointMaterial = useRef(new MeshStandardMaterial({ color: 0xff0000 })).current;

    /**
     * 측정된 모든 3D 객체(점, 선, 텍스트)를 씬에서 제거하고 상태를 초기화합니다.
     */
    const clearPoints = useCallback(() => {
        const scene = sceneRef.current;
        if (!scene) return;
        pointMeshesRef.current.forEach(p => {
            scene.remove(p);
            p.geometry.dispose();
            (p.material as Material).dispose();
        });
        pointMeshesRef.current = [];
        pointsRef.current = [];

        if (distanceSpriteRef.current) {
            scene.remove(distanceSpriteRef.current);
            distanceSpriteRef.current.material.map?.dispose();
            distanceSpriteRef.current.material.dispose();
            distanceSpriteRef.current = null;
        }
        if (lineRef.current) {
            scene.remove(lineRef.current);
            lineRef.current.geometry.dispose();
            (lineRef.current.material as Material).dispose();
            lineRef.current = null;
        }
        setDistance(null);
    }, [sceneRef]);

    /**
     * 사용자가 AR 공간의 한 지점을 탭했을 때 호출될 함수.
     * @param position - 탭한 위치의 3D 좌표.
     */
    const handleMeasurementSelect = (position: Vector3) => {
        const scene = sceneRef.current;
        if (!scene) return;

        if (pointMeshesRef.current.length >= 2) {
            clearPoints();
        }

        const sphere = new Mesh(pointGeometry, pointMaterial);
        sphere.position.copy(position);
        scene.add(sphere);
        pointMeshesRef.current.push(sphere);
        pointsRef.current.push(sphere.position.clone());

        if (pointsRef.current.length >= 2) {
            const p1 = pointsRef.current[0];
            const p2 = pointsRef.current[1];
            const d = p1.distanceTo(p2);
            setDistance(d);

            const lineGeometry = new BufferGeometry().setFromPoints([p1, p2]);
            const lineMaterial = new LineBasicMaterial({ color: 0xffffff });
            const line = new Line(lineGeometry, lineMaterial);
            scene.add(line);
            lineRef.current = line;

            const textSprite = makeTextSprite(`${d.toFixed(2)} m`, { fontsize: 24, fontface: 'Arial', borderColor: {r:0,g:0,b:0,a:1}, backgroundColor: {r:255,g:255,b:255,a:0.8} });
            textSprite.position.copy(p1).lerp(p2, 0.5).add(new Vector3(0, 0.05, 0));
            scene.add(textSprite);
            distanceSpriteRef.current = textSprite;
        }
    };

    /**
     * 매 프레임 호출되어야 하는 업데이트 함수.
     * @param camera - 현재 씬의 카메라.
     */
    const update = (camera: Camera) => {
        // 거리 텍스트가 항상 카메라를 바라보도록 방향을 업데이트
        if (distanceSpriteRef.current) {
            distanceSpriteRef.current.quaternion.copy(camera.quaternion);
        }
    };

    return { distance, handleMeasurementSelect, clearPoints, update };
}
