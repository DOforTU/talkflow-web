"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import "./SilhouettePage.css";
import { silhouetteApi } from "@/lib/api/silhouette";
import { ResponseSilhouetteDto, SilhouetteType } from "@/lib/types/silhouette.interface";
import SearchModal from "@/components/silhouettes/SearchModal";
import UploadModal from "@/components/silhouettes/UploadModal";

const LIMIT = 10;

export default function SilhouettePage() {
    const [silhouettes, setSilhouettes] = useState<ResponseSilhouetteDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [offset, setOffset] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [translateY, setTranslateY] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [showSearchModal, setShowSearchModal] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});
    const startY = useRef<number>(0);
    const currentY = useRef<number>(0);
    const isDragging = useRef<boolean>(false);
    const lastWheelTime = useRef<number>(0);
    const slideHeight = useRef<number>(0);
    const loadingRef = useRef<boolean>(false);
    const silhouettesRef = useRef<ResponseSilhouetteDto[]>([]);
    const offsetRef = useRef<number>(0);
    const hasMoreRef = useRef<boolean>(true);

    // 초기 실루엣 로드
    useEffect(() => {
        const loadInitialSilhouettes = async () => {
            try {
                setIsLoading(true);
                const fetchedSilhouettes = await silhouetteApi.getAllSilhouettes(LIMIT, 0);
                setSilhouettes(fetchedSilhouettes);
                setOffset(LIMIT);
                setHasMore(fetchedSilhouettes.length === LIMIT);

                // ref 업데이트
                silhouettesRef.current = fetchedSilhouettes;
                offsetRef.current = LIMIT;
                hasMoreRef.current = fetchedSilhouettes.length === LIMIT;
            } catch (error) {
                console.error("Failed to load silhouettes:", error);
                setSilhouettes([]);
                setHasMore(false);

                // ref 업데이트
                silhouettesRef.current = [];
                hasMoreRef.current = false;
            } finally {
                setIsLoading(false);
            }
        };

        loadInitialSilhouettes();
    }, []);

    // 추가 실루엣 로드 함수 - ref 사용으로 안정적인 useCallback
    const loadMoreSilhouettes = useCallback(async () => {
        if (loadingRef.current || !hasMoreRef.current) return;

        try {
            loadingRef.current = true;
            setIsLoadingMore(true);

            const currentOffset = silhouettesRef.current.length;
            console.log("API Request:", `limit=${LIMIT}, offset=${currentOffset}`);

            const newSilhouettes = await silhouetteApi.getAllSilhouettes(LIMIT, currentOffset);

            if (newSilhouettes.length > 0) {
                setSilhouettes((prev) => {
                    const updated = [...prev, ...newSilhouettes];
                    silhouettesRef.current = updated; // ref 업데이트
                    return updated;
                });
                setOffset((prev) => {
                    const updated = prev + LIMIT;
                    offsetRef.current = updated; // ref 업데이트
                    return updated;
                });
                const hasMoreUpdated = newSilhouettes.length === LIMIT;
                setHasMore(hasMoreUpdated);
                hasMoreRef.current = hasMoreUpdated; // ref 업데이트
            } else {
                setHasMore(false);
                hasMoreRef.current = false; // ref 업데이트
            }
        } catch (error) {
            console.error("Failed to load more silhouettes:", error);
            setHasMore(false);
            hasMoreRef.current = false; // ref 업데이트
        } finally {
            setIsLoadingMore(false);
            loadingRef.current = false;
        }
    }, []); // 빈 의존성 배열 - ref만 사용하므로 재생성되지 않음

    // 현재 인덱스가 끝에 가까워지면 더 로드
    useEffect(() => {
        const shouldLoadMore =
            currentIndex >= silhouettesRef.current.length - 3 &&
            hasMoreRef.current &&
            !loadingRef.current &&
            silhouettesRef.current.length > 0;

        if (shouldLoadMore) {
            loadMoreSilhouettes();
        }
    }, [currentIndex, loadMoreSilhouettes]); // 안정적인 의존성 배열

    // Initialize slide height and handle resize
    useEffect(() => {
        const updateSlideHeight = () => {
            // Use different height calculation for mobile vs desktop
            const isMobile = window.innerWidth <= 768;
            const vh = isMobile
                ? window.innerHeight - 80 // Mobile: match CSS height
                : window.innerHeight * 0.94; // Desktop: 94vh

            slideHeight.current = vh;
            // Initial translateY calculation
            setTranslateY(-currentIndex * vh);
        };

        updateSlideHeight();
        window.addEventListener("resize", updateSlideHeight);

        return () => {
            window.removeEventListener("resize", updateSlideHeight);
        };
    }, [currentIndex]);

    // Update translateY when currentIndex changes
    useEffect(() => {
        if (slideHeight.current > 0) {
            const newTranslateY = -currentIndex * slideHeight.current;
            setTranslateY(newTranslateY);
        }
    }, [currentIndex]);

    // Handle video playback when currentIndex changes
    useEffect(() => {
        if (silhouettes.length === 0) return;

        const currentSilhouette = silhouettes[currentIndex];

        // Pause all videos first
        Object.values(videoRefs.current).forEach((video) => {
            if (video) {
                video.pause();
            }
        });

        // If current slide is a video, play it and reset states
        if (currentSilhouette?.type === SilhouetteType.VIDEO) {
            const currentVideoElement = videoRefs.current[currentSilhouette.id];
            if (currentVideoElement) {
                setIsPlaying(true);
                setCurrentTime(0);
                currentVideoElement.currentTime = 0;
                currentVideoElement.play().catch(console.error);
            }
        }
    }, [currentIndex, silhouettes]);

    const goToSlide = (newIndex: number) => {
        if (isTransitioning || newIndex === currentIndex || newIndex < 0 || newIndex >= silhouettes.length) {
            return;
        }

        setIsTransitioning(true);
        setCurrentIndex(newIndex);

        setTimeout(() => {
            setIsTransitioning(false);
        }, 500);
    };

    const handleNext = () => {
        const nextIndex = (currentIndex + 1) % silhouettes.length;
        goToSlide(nextIndex);
    };

    const handlePrev = () => {
        const prevIndex = (currentIndex - 1 + silhouettes.length) % silhouettes.length;
        goToSlide(prevIndex);
    };

    const handleVideoClick = () => {
        const currentSilhouette = silhouettes[currentIndex];
        if (currentSilhouette?.type === SilhouetteType.VIDEO) {
            const videoElement = videoRefs.current[currentSilhouette.id];
            if (videoElement) {
                if (isPlaying) {
                    videoElement.pause();
                    setIsPlaying(false);
                } else {
                    videoElement.play();
                    setIsPlaying(true);
                }
            }
        }
    };

    const handleVideoTimeUpdate = (videoElement: HTMLVideoElement) => {
        setCurrentTime(videoElement.currentTime);
        setDuration(videoElement.duration || 0);
    };

    const handleSeekBarChange = (newTime: number) => {
        const currentSilhouette = silhouettes[currentIndex];
        if (currentSilhouette?.type === SilhouetteType.VIDEO) {
            const videoElement = videoRefs.current[currentSilhouette.id];
            if (videoElement) {
                videoElement.currentTime = newTime;
                setCurrentTime(newTime);
            }
        }
    };

    // Touch/Mouse event handlers for vertical swipe
    const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
        if (isTransitioning) return;

        isDragging.current = true;
        const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
        startY.current = clientY;
        currentY.current = clientY;
    };

    const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
        if (!isDragging.current || isTransitioning) return;

        e.preventDefault();
        const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
        currentY.current = clientY;
    };

    const handleTouchEnd = () => {
        if (!isDragging.current || isTransitioning) {
            isDragging.current = false;
            return;
        }

        const deltaY = currentY.current - startY.current;
        const threshold = 50; // Minimum swipe distance

        if (Math.abs(deltaY) > threshold) {
            if (deltaY > 0) {
                // Swipe down - go to previous (scroll up)
                handlePrev();
            } else {
                // Swipe up - go to next (scroll down)
                handleNext();
            }
        }

        isDragging.current = false;
    };

    // Keyboard and wheel navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowUp") {
                e.preventDefault();
                handlePrev();
            } else if (e.key === "ArrowDown") {
                e.preventDefault();
                handleNext();
            }
        };

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();

            // Block all scrolls during transition
            if (isTransitioning) return;

            const now = Date.now();
            // Debounce to prevent multiple slides
            if (now - lastWheelTime.current < 800) return;

            lastWheelTime.current = now;

            // Scroll threshold
            if (Math.abs(e.deltaY) > 10) {
                if (e.deltaY > 0) {
                    // Scroll down - go to next slide
                    handleNext();
                } else {
                    // Scroll up - go to previous slide
                    handlePrev();
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("wheel", handleWheel, { passive: false });

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("wheel", handleWheel);
        };
    }, [silhouettes.length, isTransitioning, currentIndex]);

    const handleUpload = () => {
        setShowUploadModal(true);
    };

    const handleSearchClick = () => {
        setShowSearchModal(true);
    };

    const handleSearchModalClose = () => {
        setShowSearchModal(false);
    };

    const handleUploadModalClose = async (uploaded?: boolean) => {
        setShowUploadModal(false);

        // 업로드가 성공했다면 실루엣 목록을 새로고침
        if (uploaded) {
            try {
                setIsLoading(true);
                const fetchedSilhouettes = await silhouetteApi.getAllSilhouettes(LIMIT, 0);
                setSilhouettes(fetchedSilhouettes);
                setOffset(LIMIT);
                setHasMore(fetchedSilhouettes.length === LIMIT);
                setCurrentIndex(0); // 처음 슬라이드로 이동
            } catch (error) {
                console.error("Failed to reload silhouettes:", error);
            } finally {
                setIsLoading(false);
            }
        }
    };

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
                    <button onClick={handleSearchClick} className="search-btn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                        </svg>
                    </button>
                    <button onClick={handleUpload} className="upload-btn">
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
                                    onClick={silhouette.type === SilhouetteType.VIDEO ? handleVideoClick : undefined}
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
                                            autoPlay={currentIndex === index && isPlaying}
                                            onTimeUpdate={(e) =>
                                                currentIndex === index && handleVideoTimeUpdate(e.currentTarget)
                                            }
                                            onLoadedMetadata={(e) =>
                                                currentIndex === index && setDuration(e.currentTarget.duration)
                                            }
                                        />
                                    ) : (
                                        <img
                                            src={silhouette.contentUrl}
                                            alt={silhouette.title}
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
                                                <p className="silhouette-title">{silhouette.title}</p>
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
                                            onChange={(e) => handleSeekBarChange(parseFloat(e.target.value))}
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
            <SearchModal isOpen={showSearchModal} onClose={handleSearchModalClose} />

            {/* Upload Modal */}
            <UploadModal isOpen={showUploadModal} onClose={handleUploadModalClose} />
        </div>
    );
}
