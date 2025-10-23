
import { create } from 'zustand';
import { FurnitureItem } from '../lib/types';

// Zustand Store의 상태(State)와 액션(Actions)을 정의하는 인터페이스
interface AppState {
  // --- 상태 (State) ---
  isARActive: boolean; // AR 세션 활성화 여부
  isPreviewing: boolean; // 가구 미리보기 모드 여부
  selectedFurniture: FurnitureItem | null; // 사용자가 선택한 가구
  distance: number | null; // 측정된 거리

  // --- 3D 씬 조작을 위한 트리거 상태 ---
  clearFurnitureCounter: number; // 가구 제거 액션이 호출된 횟수
  clearMeasurementCounter: number; // 측정 제거 액션이 호출된 횟수
  endARCounter: number; // AR 종료 액션이 호출된 횟수

  // --- 액션 (Actions) ---
  setARActive: (isActive: boolean) => void; // AR 세션 상태 변경
  setIsPreviewing: (isPreviewing: boolean) => void; // 미리보기 모드 변경
  selectFurniture: (furniture: FurnitureItem | null) => void; // 가구 선택
  setDistance: (distance: number | null) => void; // 측정된 거리 업데이트
  triggerClearFurniture: () => void; // 가구 제거 트리거
  triggerClearMeasurement: () => void; // 측정 제거 트리거
  triggerEndAR: () => void; // AR 종료 트리거
  
  // 상태 초기화를 위한 함수
  reset: () => void;
}

// Zustand store 생성
export const useStore = create<AppState>((set) => ({
  // --- 초기 상태 ---
  isARActive: false,
  isPreviewing: false,
  selectedFurniture: null,
  distance: null,
  clearFurnitureCounter: 0,
  clearMeasurementCounter: 0,
  endARCounter: 0,

  // --- 액션 구현 ---
  setARActive: (isActive) => set({ isARActive: isActive }),
  setIsPreviewing: (isPreviewing) => set({ isPreviewing }),
  selectFurniture: (furniture) => set({ selectedFurniture: furniture, isPreviewing: !!furniture }),
  setDistance: (distance) => set({ distance }),

  // 트리거 액션이 호출되면, 해당하는 카운터를 1 증가시킵니다.
  triggerClearFurniture: () => set((state) => ({ clearFurnitureCounter: state.clearFurnitureCounter + 1 })),
  triggerClearMeasurement: () => set((state) => ({ clearMeasurementCounter: state.clearMeasurementCounter + 1 })),
  triggerEndAR: () => set((state) => ({ endARCounter: state.endARCounter + 1 })),
  
  // 모든 상태를 초기값으로 되돌리는 reset 함수
  reset: () => set({
    isARActive: false,
    isPreviewing: false,
    selectedFurniture: null,
    distance: null,
    clearFurnitureCounter: 0,
    clearMeasurementCounter: 0,
    endARCounter: 0,
  }),
}));
