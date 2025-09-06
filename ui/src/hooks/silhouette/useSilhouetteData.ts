import { useState, useRef, useCallback } from 'react';
import { silhouetteApi } from '@/lib/api/silhouette';
import { ResponseSilhouetteDto } from '@/lib/types/silhouette.interface';

/**
 * 페이징 및 로딩 관련 상수
 */
const LIMIT = 10; // 한 번에 로드할 실루엣 개수

/**
 * 실루엣 데이터 상태를 관리하는 인터페이스
 * @interface SilhouetteDataState  
 * @property {ResponseSilhouetteDto[]} silhouettes - 현재 로드된 실루엣 목록
 * @property {boolean} isLoading - 초기 로딩 상태 (전체 화면 로딩 표시용)
 * @property {boolean} isLoadingMore - 추가 로딩 상태 (무한 스크롤용)
 * @property {boolean} hasMore - 더 불러올 데이터가 있는지 여부
 * @property {number} offset - 다음 요청시 사용할 오프셋 값
 */
interface SilhouetteDataState {
    silhouettes: ResponseSilhouetteDto[];
    isLoading: boolean;
    isLoadingMore: boolean;
    hasMore: boolean;
    offset: number;
}

/**
 * 실루엣 데이터 로딩 및 무한 스크롤을 관리하는 커스텀 훅
 * 
 * 생성 목적:
 * - API 호출을 통한 실루엣 데이터 관리
 * - 무한 스크롤을 위한 페이지네이션 처리
 * - 로딩 상태 관리 (초기 로딩, 추가 로딩)
 * - 데이터 새로고침 기능
 * 
 * 주요 기능:
 * - 초기 실루엣 목록 로딩
 * - 스크롤에 따른 추가 데이터 로딩
 * - ref를 통한 안정적인 상태 추적
 * - 중복 요청 방지
 * 
 * @returns {Object} 실루엣 데이터 상태와 로딩 함수들
 */
export const useSilhouetteData = () => {
    /**
     * 실루엣 데이터의 전체 상태를 관리하는 state
     * 로딩 상태, 데이터, 페이지네이션 정보를 포함
     */
    const [state, setState] = useState<SilhouetteDataState>({
        silhouettes: [],
        isLoading: true,
        isLoadingMore: false,
        hasMore: true,
        offset: 0,
    });

    /**
     * 무한 스크롤의 안정적인 동작을 위한 refs
     * useCallback 의존성 배열의 불안정성을 방지
     */
    const loadingRef = useRef<boolean>(false); // 현재 로딩 중인지 추적
    const silhouettesRef = useRef<ResponseSilhouetteDto[]>([]); // 현재 로드된 실루엣들
    const offsetRef = useRef<number>(0); // 현재 오프셋 값
    const hasMoreRef = useRef<boolean>(true); // 더 가져올 데이터가 있는지

    /**
     * 초기 실루엣 목록을 로드하는 함수
     * 앱 시작시나 새로고침시 호출됨
     */
    const loadInitialSilhouettes = useCallback(async () => {
        try {
            setState((prev) => ({ ...prev, isLoading: true }));
            const fetchedSilhouettes = await silhouetteApi.getAllSilhouettes(LIMIT, 0);

            const newState = {
                silhouettes: fetchedSilhouettes,
                isLoading: false,
                isLoadingMore: false,
                hasMore: fetchedSilhouettes.length === LIMIT,
                offset: LIMIT,
            };

            setState(newState);

            // Update refs for stable infinite scroll
            silhouettesRef.current = fetchedSilhouettes;
            offsetRef.current = LIMIT;
            hasMoreRef.current = fetchedSilhouettes.length === LIMIT;
        } catch (error) {
            console.error("Failed to load silhouettes:", error);
            const errorState = {
                silhouettes: [],
                isLoading: false,
                isLoadingMore: false,
                hasMore: false,
                offset: 0,
            };

            setState(errorState);
            silhouettesRef.current = [];
            hasMoreRef.current = false;
        }
    }, []);

    /**
     * 추가 실루엣 목록을 로드하는 함수 (무한 스크롤용)
     * 사용자가 끝에 가까워질 때 자동으로 호출됨
     */
    const loadMoreSilhouettes = useCallback(async () => {
        // 이미 로딩 중이거나 더 가져올 데이터가 없으면 리턴
        if (loadingRef.current || !hasMoreRef.current) return;

        try {
            loadingRef.current = true;
            setState((prev) => ({ ...prev, isLoadingMore: true }));

            const currentOffset = silhouettesRef.current.length;
            const newSilhouettes = await silhouetteApi.getAllSilhouettes(LIMIT, currentOffset);

            if (newSilhouettes.length > 0) {
                setState((prev) => {
                    const updatedSilhouettes = [...prev.silhouettes, ...newSilhouettes];
                    const updated = {
                        ...prev,
                        silhouettes: updatedSilhouettes,
                        offset: prev.offset + LIMIT,
                        hasMore: newSilhouettes.length === LIMIT,
                        isLoadingMore: false,
                    };

                    // Update refs
                    silhouettesRef.current = updatedSilhouettes;
                    offsetRef.current = updated.offset;
                    hasMoreRef.current = updated.hasMore;

                    return updated;
                });
            } else {
                // 더 이상 가져올 데이터가 없음
                setState((prev) => ({ ...prev, hasMore: false, isLoadingMore: false }));
                hasMoreRef.current = false;
            }
        } catch (error) {
            console.error("Failed to load more silhouettes:", error);
            setState((prev) => ({ ...prev, hasMore: false, isLoadingMore: false }));
            hasMoreRef.current = false;
        } finally {
            loadingRef.current = false;
        }
    }, []);

    /**
     * 실루엣 목록을 새로고침하는 함수
     * 업로드 후나 강제 새로고침시 사용
     */
    const reloadSilhouettes = useCallback(async () => {
        await loadInitialSilhouettes();
    }, [loadInitialSilhouettes]);

    return {
        // 상태값들
        ...state,
        // Refs (다른 컴포넌트에서 필요할 수 있음)
        silhouettesRef,
        hasMoreRef,
        loadingRef,
        // 함수들
        loadInitialSilhouettes,
        loadMoreSilhouettes,
        reloadSilhouettes,
    };
};