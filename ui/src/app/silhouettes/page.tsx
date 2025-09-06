"use client";

import { useState, useEffect, useRef } from "react";
import "./SilhouettePage.css";
import { SilhouetteType } from "@/lib/types/silhouette.interface";
import SearchModal from "@/components/silhouettes/SearchModal";
import UploadModal from "@/components/silhouettes/UploadModal";
import BottomNav from "@/components/navigation/BottomNav";
import { useSilhouetteData } from "@/hooks/silhouette/useSilhouetteData";
import { useSlideNavigation } from "@/hooks/silhouette/useSlideNavigation";
import { useVideoControl } from "@/hooks/silhouette/useVideoControl";
import { useTouchNavigation } from "@/hooks/silhouette/useTouchNavigation";

export default function SilhouettePage() {
    // ==================== MODAL STATE ====================
    const [modalState, setModalState] = useState({
        showSearchModal: false,
        showUploadModal: false,
    });

    // ==================== CUSTOM HOOKS ====================
    const { silhouettes, isLoading, isLoadingMore, hasMore, offset, loadInitialSilhouettes, loadMoreSilhouettes } =
        useSilhouetteData();

    const {
        currentIndex,
        isTransitioning,
        translateY,
        goToSlide,
        handleNext,
        handlePrev,
        updateSlideHeight,
        updateTranslateY,
        resetToFirst,
    } = useSlideNavigation(silhouettes.length);

    const {
        isPlaying,
        currentTime,
        duration,
        videoRefs,
        handleVideoClick: videoHandleClick,
        handleVideoTimeUpdate,
        handleSeekBarChange,
    } = useVideoControl();

    const { handleTouchStart, handleTouchMove, handleTouchEnd, handleKeyDown, handleWheel } = useTouchNavigation(
        isTransitioning,
        handleNext,
        handlePrev
    );

    // ==================== REFS ====================
    const containerRef = useRef<HTMLDivElement>(null);

    // ==================== MODAL HANDLERS ====================
    const openUploadModal = () => setModalState((prev) => ({ ...prev, showUploadModal: true }));

    const openSearchModal = () => setModalState((prev) => ({ ...prev, showSearchModal: true }));

    const closeSearchModal = () => setModalState((prev) => ({ ...prev, showSearchModal: false }));

    const closeUploadModal = async (uploaded?: boolean) => {
        setModalState((prev) => ({ ...prev, showUploadModal: false }));
        if (uploaded) {
            await loadInitialSilhouettes();
            resetToFirst();
        }
    };

    // ==================== VIDEO HANDLERS ====================
    const clickVideo = () => {
        const currentSilhouette = silhouettes[currentIndex];
        if (currentSilhouette) {
            videoHandleClick(currentSilhouette);
        }
    };

    const handleSeekChange = (newTime: number) => {
        const currentSilhouette = silhouettes[currentIndex];
        if (currentSilhouette?.type === SilhouetteType.VIDEO) {
            const videoElement = videoRefs.current[currentSilhouette.id];
            if (videoElement) {
                videoElement.currentTime = newTime;
            }
        }
        handleSeekBarChange(newTime);
    };

    // ==================== EFFECTS ====================
    // 초기 로드
    useEffect(() => {
        loadInitialSilhouettes();
    }, [loadInitialSilhouettes]);

    // 무한 스크롤: 현재 인덱스가 끝에 가까워지면 더 로드
    useEffect(() => {
        const shouldLoadMore = currentIndex >= silhouettes.length - 3 && hasMore && !isLoading && !isLoadingMore;
        if (shouldLoadMore) {
            loadMoreSilhouettes();
        }
    }, [currentIndex, silhouettes.length, hasMore, isLoading, isLoadingMore, loadMoreSilhouettes]);

    // 슬라이드 높이 초기화 및 리사이즈 핸들러
    useEffect(() => {
        updateSlideHeight();
        window.addEventListener("resize", updateSlideHeight);
        return () => window.removeEventListener("resize", updateSlideHeight);
    }, [updateSlideHeight]);

    // translateY 업데이트
    useEffect(() => {
        updateTranslateY();
    }, [currentIndex, updateTranslateY]);

    // 키보드 이벤트 리스너
    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);

    // 휠 이벤트 리스너
    useEffect(() => {
        const handleWheelEvent = (e: WheelEvent) => handleWheel(e);
        window.addEventListener("wheel", handleWheelEvent, { passive: false });
        return () => window.removeEventListener("wheel", handleWheelEvent);
    }, [handleWheel]);

    // 비디오 재생 관리: 현재 인덱스 변경시 비디오 처리
    useEffect(() => {
        if (silhouettes.length === 0) return;

        const currentSilhouette = silhouettes[currentIndex];

        // 모든 비디오 일시정지
        Object.values(videoRefs.current).forEach((video) => {
            if (video) video.pause();
        });

        // 현재 슬라이드가 비디오면 재생
        if (currentSilhouette?.type === SilhouetteType.VIDEO) {
            const currentVideoElement = videoRefs.current[currentSilhouette.id];
            if (currentVideoElement) {
                currentVideoElement.currentTime = 0;
                currentVideoElement.play().catch(console.error);
            }
        }
    }, [currentIndex, silhouettes, videoRefs]);

    // ==================== RENDER CONDITIONS ====================
    if (isLoading) {
        return (
            <div className="silhouette-loading">
                <div className="loading-spinner"></div>
                <p>실루엣을 불러오는 중...</p>
            </div>
        );
    }

    if (silhouettes.length === 0) {
        return (
            <div className="silhouette-empty">
                <div className="empty-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21,15 16,10 5,21" />
                    </svg>
                </div>
                <h3>현재 실루엣이 없습니다</h3>
                <p>새로운 실루엣을 업로드하거나 다시 시도해보세요.</p>
            </div>
        );
    }

    return (
        <div className="silhouette-page">
            {/* Search and Upload Header */}
            <div className="silhouette-header">
                <div className="search-upload-container">
                    <button onClick={openSearchModal} className="search-btn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                        </svg>
                    </button>
                    <button onClick={openUploadModal} className="upload-btn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                            <polyline points="14,2 14,8 20,8" />
                            <line x1="12" y1="18" x2="12" y2="12" />
                            <line x1="9" y1="15" x2="15" y2="15" />
                        </svg>
                    </button>
                </div>
            </div>

            <div
                className="silhouette-container"
                ref={containerRef}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleTouchStart}
                onMouseMove={handleTouchMove}
                onMouseUp={handleTouchEnd}
                onMouseLeave={handleTouchEnd}
            >
                {/* Slides Wrapper with Transform */}
                <div
                    className="slides-wrapper"
                    style={{
                        transform: `translateY(${translateY}px)`,
                        transition: isTransitioning ? "transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)" : "none",
                    }}
                >
                    {silhouettes.map((silhouette, index) => {
                        // Only render slides that are visible (current, previous, next)
                        const isVisible = Math.abs(index - currentIndex) <= 1;
                        if (!isVisible) {
                            return (
                                <div
                                    key={`${silhouette.id}-${index}`}
                                    className="slide"
                                    style={{ opacity: 0, pointerEvents: "none" }}
                                ></div>
                            );
                        }

                        return (
                            <div
                                key={`${silhouette.id}-${index}`}
                                className="slide"
                                style={{
                                    opacity: index === currentIndex ? 1 : 0,
                                    transition: "opacity 0.3s ease-out",
                                }}
                            >
                                <div
                                    className="silhouette-video-container"
                                    onClick={silhouette.type === SilhouetteType.VIDEO ? clickVideo : undefined}
                                >
                                    {silhouette.type === SilhouetteType.VIDEO ? (
                                        <video
                                            ref={(el) => {
                                                if (el) {
                                                    videoRefs.current[silhouette.id] = el;
                                                }
                                            }}
                                            src={silhouette.contentUrl}
                                            className="silhouette-video"
                                            loop
                                            muted
                                            onTimeUpdate={(e) =>
                                                currentIndex === index && handleVideoTimeUpdate(e.currentTarget)
                                            }
                                            onLoadedMetadata={(e) =>
                                                currentIndex === index && (e.currentTarget.duration || 0)
                                            }
                                        />
                                    ) : (
                                        <img
                                            src={silhouette.contentUrl}
                                            alt={silhouette.title || "Silhouette Image"}
                                            className="silhouette-image"
                                        />
                                    )}

                                    {/* Play/Pause Indicator */}
                                    {silhouette.type === SilhouetteType.VIDEO &&
                                        currentIndex === index &&
                                        !isPlaying && (
                                            <div className="play-pause-overlay">
                                                <div className="play-icon">
                                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M8 5v14l11-7z" />
                                                    </svg>
                                                </div>
                                            </div>
                                        )}
                                </div>

                                {/* Slide overlay */}
                                <div className="silhouette-overlay">
                                    <div className="user-info">
                                        <div className="user-profile">
                                            <img
                                                src={silhouette.profile.avatarUrl || "/default-avatar.png"}
                                                alt={silhouette.profile.nickname}
                                                className="user-avatar"
                                            />
                                            <div className="user-details">
                                                <p className="user-nickname">@{silhouette.profile.nickname}</p>
                                                <p className="silhouette-title">{silhouette.title || "제목 없음"}</p>
                                            </div>
                                        </div>
                                        <div className="action-buttons">
                                            <button className="action-btn like-btn">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                                </svg>
                                            </button>

                                            <button className="action-btn share-btn">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                    <circle cx="18" cy="5" r="3" />
                                                    <circle cx="6" cy="12" r="3" />
                                                    <circle cx="18" cy="19" r="3" />
                                                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                                                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Custom Video Seek Bar - Only show for video content */}
                                {silhouettes[currentIndex]?.type === SilhouetteType.VIDEO && (
                                    <div className="video-seek-bar">
                                        <input
                                            type="range"
                                            min="0"
                                            max={duration || 0}
                                            value={currentTime}
                                            onChange={(e) => handleSeekChange(parseFloat(e.target.value))}
                                            className="seek-slider"
                                            style={
                                                {
                                                    "--progress": `${
                                                        duration > 0 ? (currentTime / duration) * 100 : 0
                                                    }%`,
                                                } as React.CSSProperties
                                            }
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Search Modal */}
            <SearchModal isOpen={modalState.showSearchModal} onClose={closeSearchModal} />

            {/* Upload Modal */}
            <UploadModal isOpen={modalState.showUploadModal} onClose={closeUploadModal} />

            {/* Bottom Navigation */}
            <BottomNav />
        </div>
    );
}
