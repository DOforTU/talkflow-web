import { useRef, useCallback } from 'react';

/**
 * 터치, 마우스, 키보드 입력을 통한 네비게이션을 관리하는 커스텀 훅
 * 
 * 생성 목적:
 * - 다양한 입력 방식 (터치, 마우스 드래그, 키보드, 휠)에 대한 통합 처리
 * - 스와이프 제스처 감지 및 방향 판별
 * - 입력 감도 조절 및 중복 실행 방지
 * - 크로스 플랫폼 호환성 (모바일/데스크톱)
 * 
 * 주요 기능:
 * - 터치/마우스 드래그로 상하 스와이프 감지
 * - 키보드 화살표 키를 통한 네비게이션
 * - 마우스 휠을 통한 네비게이션
 * - 임계값 기반 제스처 인식
 * - 이벤트 중복 방지 및 디바운싱
 * 
 * @param {boolean} isTransitioning - 현재 전환 애니메이션이 진행 중인지 여부
 * @param {Function} handleNext - 다음 슬라이드로 이동하는 함수
 * @param {Function} handlePrev - 이전 슬라이드로 이동하는 함수
 * @returns {Object} 각종 이벤트 핸들러 함수들
 */
export const useTouchNavigation = (
    isTransitioning: boolean,
    handleNext: () => void,
    handlePrev: () => void
) => {
    /**
     * 터치/마우스 드래그 상태를 추적하는 refs
     * state 대신 ref 사용으로 리렌더링 방지 및 성능 최적화
     */
    const startY = useRef<number>(0); // 터치/드래그 시작 Y 좌표
    const currentY = useRef<number>(0); // 현재 터치/드래그 Y 좌표
    const isDragging = useRef<boolean>(false); // 현재 드래그 중인지 여부
    const lastWheelTime = useRef<number>(0); // 마지막 휠 이벤트 시간 (디바운싱용)

    /**
     * 터치 또는 마우스 다운 이벤트 핸들러
     * 드래그 시작점을 기록하고 드래그 상태를 활성화
     * @param {React.TouchEvent | React.MouseEvent} e - 터치 또는 마우스 이벤트
     */
    const handleTouchStart = useCallback((e: React.TouchEvent | React.MouseEvent) => {
        if (isTransitioning) return; // 전환 중에는 무시

        isDragging.current = true;
        // 터치와 마우스 이벤트 모두 처리
        const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
        startY.current = clientY;
        currentY.current = clientY;
    }, [isTransitioning]);

    /**
     * 터치 또는 마우스 이동 이벤트 핸들러
     * 드래그 중일 때 현재 위치를 업데이트
     * @param {React.TouchEvent | React.MouseEvent} e - 터치 또는 마우스 이벤트
     */
    const handleTouchMove = useCallback((e: React.TouchEvent | React.MouseEvent) => {
        if (!isDragging.current || isTransitioning) return; // 드래그 중이 아니거나 전환 중이면 무시

        e.preventDefault(); // 기본 스크롤 동작 방지
        const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
        currentY.current = clientY;
    }, [isTransitioning]);

    /**
     * 터치 또는 마우스 업 이벤트 핸들러
     * 드래그 거리를 계산하여 스와이프 방향 결정
     */
    const handleTouchEnd = useCallback(() => {
        if (!isDragging.current || isTransitioning) {
            isDragging.current = false;
            return;
        }

        const deltaY = currentY.current - startY.current;
        const threshold = 50; // 스와이프 인식 최소 거리 (50px)

        // 임계값을 넘은 경우에만 슬라이드 이동
        if (Math.abs(deltaY) > threshold) {
            if (deltaY > 0) {
                // 아래로 스와이프 → 이전 슬라이드
                handlePrev();
            } else {
                // 위로 스와이프 → 다음 슬라이드
                handleNext();
            }
        }
        
        isDragging.current = false;
    }, [isTransitioning, handleNext, handlePrev]);

    /**
     * 키보드 이벤트 핸들러
     * 화살표 키(위/아래)를 통한 네비게이션
     * @param {KeyboardEvent} e - 키보드 이벤트
     */
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === "ArrowUp") {
            e.preventDefault(); // 기본 스크롤 방지
            handlePrev();
        } else if (e.key === "ArrowDown") {
            e.preventDefault(); // 기본 스크롤 방지
            handleNext();
        }
    }, [handleNext, handlePrev]);

    /**
     * 마우스 휠 이벤트 핸들러
     * 휠 방향에 따라 슬라이드 이동, 디바운싱 적용
     * @param {WheelEvent} e - 휠 이벤트
     */
    const handleWheel = useCallback((e: WheelEvent) => {
        e.preventDefault(); // 기본 스크롤 방지
        if (isTransitioning) return; // 전환 중에는 무시

        const now = Date.now();
        const debounceTime = 800; // 800ms 디바운싱 (너무 빠른 연속 실행 방지)
        
        if (now - lastWheelTime.current < debounceTime) return;
        lastWheelTime.current = now;

        const wheelSensitivity = 10; // 휠 감도 임계값

        if (Math.abs(e.deltaY) > wheelSensitivity) {
            if (e.deltaY > 0) {
                // 아래로 휠 → 다음 슬라이드
                handleNext();
            } else {
                // 위로 휠 → 이전 슬라이드
                handlePrev();
            }
        }
    }, [isTransitioning, handleNext, handlePrev]);

    return {
        // 터치/마우스 이벤트 핸들러들
        handleTouchStart,
        handleTouchMove,
        handleTouchEnd,
        // 키보드/휠 이벤트 핸들러들
        handleKeyDown,
        handleWheel,
    };
};