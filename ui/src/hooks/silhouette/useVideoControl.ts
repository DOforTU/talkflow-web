import { useState, useRef, useCallback } from "react";
import { SilhouetteType } from "@/lib/types/silhouette.interface";

/**
 * 비디오 재생 상태를 관리하는 인터페이스
 * @interface VideoState
 * @property {boolean} isPlaying - 현재 비디오 재생 여부 (true: 재생 중, false: 일시정지)
 * @property {number} currentTime - 현재 비디오 재생 시간 (초 단위)
 * @property {number} duration - 전체 비디오 길이 (초 단위)
 */
interface VideoState {
    isPlaying: boolean;
    currentTime: number;
    duration: number;
}

/**
 * 실루엣 페이지의 비디오 재생 제어를 담당하는 커스텀 훅
 *
 * 생성 목적:
 * - 비디오 재생/일시정지 상태 관리
 * - 시크바 조작 및 시간 추적
 * - 여러 비디오 요소의 참조 관리
 * - 비디오 관련 사용자 상호작용 처리
 *
 * 주요 기능:
 * - 비디오 클릭시 재생/일시정지 토글
 * - 시크바를 통한 구간 이동
 * - 현재 재생 시간 및 전체 길이 추적
 * - 모든 비디오 일시정지 기능
 *
 * @returns {Object} 비디오 제어 관련 상태와 함수들
 */
export const useVideoControl = () => {
    /**
     * 비디오 재생 상태를 관리하는 state
     * isPlaying: 재생/일시정지 상태
     * currentTime: 현재 재생 시점 (초)
     * duration: 전체 비디오 길이 (초)
     */
    const [state, setState] = useState<VideoState>({
        isPlaying: true,
        currentTime: 0,
        duration: 0,
    });

    /**
     * 각 실루엣의 video DOM 요소를 저장하는 ref
     * key: 실루엣 ID, value: video HTML 요소
     */
    const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

    /**
     * 비디오 클릭시 재생/일시정지를 토글하는 함수
     * @param {any} silhouette - 클릭된 실루엣 객체 (type과 id 속성 필요)
     */
    const handleVideoClick = useCallback(
        (silhouette: any) => {
            if (silhouette?.type === SilhouetteType.VIDEO) {
                const videoElement = videoRefs.current[silhouette.id];
                if (videoElement) {
                    if (state.isPlaying) {
                        videoElement.pause();
                        setState((prev) => ({ ...prev, isPlaying: false }));
                    } else {
                        videoElement.play();
                        setState((prev) => ({ ...prev, isPlaying: true }));
                    }
                }
            }
        },
        [state.isPlaying]
    );

    /**
     * 비디오 재생 시간이 업데이트될 때 호출되는 함수
     * video의 ontimeupdate 이벤트에서 사용
     * @param {HTMLVideoElement} videoElement - 시간이 업데이트된 video 요소
     */
    const handleVideoTimeUpdate = useCallback((videoElement: HTMLVideoElement) => {
        setState((prev) => ({
            ...prev,
            currentTime: videoElement.currentTime,
            duration: videoElement.duration || 0,
        }));
    }, []);

    /**
     * 시크바 조작시 비디오 재생 시점을 변경하는 함수
     * @param {number} newTime - 이동할 시간 (초 단위)
     */
    const handleSeekBarChange = useCallback((newTime: number) => {
        setState((prev) => ({ ...prev, currentTime: newTime }));
    }, []);

    /**
     * 특정 실루엣의 비디오를 처음부터 재생하는 함수
     * 슬라이드 변경시 새로운 비디오 재생에 사용
     * @param {any} silhouette - 재생할 실루엣 객체
     */
    const playCurrentVideo = useCallback((silhouette: any) => {
        if (silhouette?.type === SilhouetteType.VIDEO) {
            const currentVideoElement = videoRefs.current[silhouette.id];
            if (currentVideoElement) {
                setState((prev) => ({ ...prev, isPlaying: true, currentTime: 0 }));
                currentVideoElement.currentTime = 0;
                currentVideoElement.play().catch(console.error);
            }
        }
    }, []);

    /**
     * 모든 비디오를 일시정지하는 함수
     * 슬라이드 변경시 이전 비디오들을 정리할 때 사용
     */
    const pauseAllVideos = useCallback(() => {
        Object.values(videoRefs.current).forEach((video) => {
            if (video) video.pause();
        });
    }, []);

    return {
        ...state,
        videoRefs,
        handleVideoClick,
        handleVideoTimeUpdate,
        handleSeekBarChange,
        playCurrentVideo,
        pauseAllVideos,
    };
};
