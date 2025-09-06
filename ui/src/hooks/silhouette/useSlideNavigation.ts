import { useState, useRef, useCallback } from "react";

/**
 * 슬라이드 네비게이션 상태를 관리하는 인터페이스
 * @interface SlideState
 * @property {number} currentIndex - 현재 표시중인 슬라이드의 인덱스
 * @property {boolean} isTransitioning - 슬라이드 전환 애니메이션 진행 중인지 여부
 * @property {number} translateY - Y축 변형값 (슬라이드 위치 제어용)
 */
interface SlideState {
    currentIndex: number;
    isTransitioning: boolean;
    translateY: number;
}

/**
 * 실루엣 슬라이드 네비게이션을 관리하는 커스텀 훅
 * 
 * 생성 목적:
 * - 세로 방향 슬라이드 전환 관리
 * - 터치/스와이프/키보드 입력에 대한 슬라이드 이동
 * - 반응형 슬라이드 높이 계산
 * - 애니메이션 상태 관리
 * 
 * 주요 기능:
 * - 다음/이전 슬라이드로 이동
 * - 특정 인덱스로 직접 이동
 * - 화면 크기에 따른 슬라이드 높이 자동 조절
 * - 전환 애니메이션 중 중복 실행 방지
 * - 첫 번째 슬라이드로 리셋 기능
 * 
 * @param {number} silhouettesLength - 전체 실루엣 개수
 * @returns {Object} 슬라이드 네비게이션 관련 상태와 함수들
 */
export const useSlideNavigation = (silhouettesLength: number) => {
    /**
     * 슬라이드 네비게이션의 전체 상태를 관리하는 state
     * currentIndex: 현재 보이는 슬라이드 번호
     * isTransitioning: 애니메이션 진행 상태 (중복 실행 방지용)
     * translateY: CSS transform translateY 값 (px 단위)
     */
    const [state, setState] = useState<SlideState>({
        currentIndex: 0,
        isTransitioning: false,
        translateY: 0,
    });

    /**
     * 각 슬라이드의 높이를 저장하는 ref
     * 화면 크기에 따라 동적으로 계산됨
     * - 모바일 (≤768px): window.innerHeight - 80px (하단 네비게이션 제외)
     * - 데스크톱 (>768px): window.innerHeight * 0.94 (94vh)
     */
    const slideHeight = useRef<number>(0);

    /**
     * 특정 인덱스의 슬라이드로 이동하는 함수
     * @param {number} newIndex - 이동할 슬라이드 인덱스
     */
    const goToSlide = useCallback(
        (newIndex: number) => {
            // 전환 중이거나 같은 인덱스이거나 유효하지 않은 인덱스면 무시
            if (
                state.isTransitioning ||
                newIndex === state.currentIndex ||
                newIndex < 0 ||
                newIndex >= silhouettesLength
            ) {
                return;
            }

            // 전환 시작
            setState((prev) => ({ ...prev, isTransitioning: true, currentIndex: newIndex }));
            
            // 500ms 후 전환 완료 처리
            setTimeout(() => {
                setState((prev) => ({ ...prev, isTransitioning: false }));
            }, 500);
        },
        [state.isTransitioning, state.currentIndex, silhouettesLength]
    );

    /**
     * 다음 슬라이드로 이동하는 함수
     * 마지막 슬라이드에서는 첫 번째로 순환
     */
    const handleNext = useCallback(() => {
        const nextIndex = (state.currentIndex + 1) % silhouettesLength;
        goToSlide(nextIndex);
    }, [state.currentIndex, silhouettesLength, goToSlide]);

    /**
     * 이전 슬라이드로 이동하는 함수
     * 첫 번째 슬라이드에서는 마지막으로 순환
     */
    const handlePrev = useCallback(() => {
        const prevIndex = (state.currentIndex - 1 + silhouettesLength) % silhouettesLength;
        goToSlide(prevIndex);
    }, [state.currentIndex, silhouettesLength, goToSlide]);

    /**
     * 화면 크기에 따라 슬라이드 높이를 업데이트하는 함수
     * 윈도우 리사이즈 이벤트에서 호출됨
     */
    const updateSlideHeight = useCallback(() => {
        const isMobile = window.innerWidth <= 768;
        const vh = isMobile 
            ? window.innerHeight - 80  // 모바일: 하단 네비게이션 높이 제외
            : window.innerHeight * 0.94; // 데스크톱: 94vh

        slideHeight.current = vh;
        // 현재 인덱스에 맞춰 translateY도 즉시 업데이트
        setState((prev) => ({ ...prev, translateY: -prev.currentIndex * vh }));
    }, []);

    /**
     * 현재 인덱스에 따라 translateY 값을 업데이트하는 함수
     * currentIndex가 변경될 때마다 호출됨
     */
    const updateTranslateY = useCallback(() => {
        if (slideHeight.current > 0) {
            const newTranslateY = -state.currentIndex * slideHeight.current;
            setState((prev) => ({ ...prev, translateY: newTranslateY }));
        }
    }, [state.currentIndex]);

    /**
     * 첫 번째 슬라이드로 리셋하는 함수
     * 새로운 데이터 로드 후 사용
     */
    const resetToFirst = useCallback(() => {
        setState({ 
            currentIndex: 0, 
            isTransitioning: false, 
            translateY: 0 
        });
    }, []);

    return {
        // 상태값들
        ...state,
        // Refs
        slideHeight,
        // 네비게이션 함수들
        goToSlide,
        handleNext,
        handlePrev,
        // 유틸리티 함수들
        updateSlideHeight,
        updateTranslateY,
        resetToFirst,
    };
};