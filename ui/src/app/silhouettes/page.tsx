"use client";

import { useState, useEffect, useRef } from "react";
import "./SilhouettePage.css";
import { silhouetteApi } from "@/lib/api/silhouette";
import { ResponseSilhouetteDto, SilhouetteType } from "@/lib/types/silhouette.interface";

export default function SilhouettePage() {
    const [silhouettes, setSilhouettes] = useState<ResponseSilhouetteDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [direction, setDirection] = useState<"up" | "down">("up");
    const containerRef = useRef<HTMLDivElement>(null);
    const startY = useRef<number>(0);
    const currentY = useRef<number>(0);
    const isDragging = useRef<boolean>(false);
    const lastWheelTime = useRef<number>(0);

    useEffect(() => {
        const loadSilhouettes = async () => {
            try {
                setIsLoading(true);
                const fetchedSilhouettes = await silhouetteApi.getAllSilhouettes();
                setSilhouettes(fetchedSilhouettes);
            } catch (error) {
                console.error("Failed to load silhouettes:", error);
                setSilhouettes([]);
            } finally {
                setIsLoading(false);
            }
        };

        loadSilhouettes();
    }, []);

    const handleNext = () => {
        if (isTransitioning) return;
        setDirection("up");
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % silhouettes.length);
            setIsTransitioning(false);
        }, 200);
    };

    const handlePrev = () => {
        if (isTransitioning) return;
        setDirection("down");
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev - 1 + silhouettes.length) % silhouettes.length);
            setIsTransitioning(false);
        }, 200);
    };

    // Touch/Mouse event handlers for vertical swipe
    const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
        isDragging.current = true;
        const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
        startY.current = clientY;
        currentY.current = clientY;
    };

    const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
        if (!isDragging.current) return;

        e.preventDefault();
        const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
        currentY.current = clientY;
    };

    const handleTouchEnd = () => {
        if (!isDragging.current) return;
        
        // Block touch navigation during transition
        if (isTransitioning) {
            isDragging.current = false;
            return;
        }

        const deltaY = currentY.current - startY.current;
        const threshold = 30; // Even more sensitive for touch

        if (Math.abs(deltaY) > threshold) {
            if (deltaY > 0) {
                // Swipe down - go to previous
                handlePrev();
            } else {
                // Swipe up - go to next
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
            if (now - lastWheelTime.current < 100) return; // Prevent rapid scrolling

            lastWheelTime.current = now;

            // Single scroll triggers navigation - very sensitive
            if (Math.abs(e.deltaY) > 1) {
                if (e.deltaY > 0) {
                    // Scroll down - go to next
                    handleNext();
                } else {
                    // Scroll up - go to previous
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
    }, [silhouettes.length]);

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

    const currentSilhouette = silhouettes[currentIndex];
    const nextSilhouette = silhouettes[(currentIndex + 1) % silhouettes.length];
    const prevSilhouette = silhouettes[(currentIndex - 1 + silhouettes.length) % silhouettes.length];

    return (
        <div className="silhouette-page">
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
                {/* Multiple slides for smooth transition */}
                <div className={`slide-container ${isTransitioning ? `transitioning-${direction}` : ""}`}>
                    {/* Previous slide */}
                    <div className="slide slide-prev">
                        <div className="silhouette-video-container">
                            {/* TEMPORARY - Index display for testing */}
                            <div className="slide-index">
                                {(currentIndex - 1 + silhouettes.length) % silhouettes.length}
                            </div>
                            {/* END TEMPORARY */}
                            {prevSilhouette && prevSilhouette.type === SilhouetteType.VIDEO ? (
                                <video src={prevSilhouette.contentUrl} className="silhouette-video" muted />
                            ) : prevSilhouette ? (
                                <img
                                    src={prevSilhouette.contentUrl}
                                    alt={prevSilhouette.title}
                                    className="silhouette-image"
                                />
                            ) : null}
                        </div>
                        {/* Previous slide overlay */}
                        <div className="silhouette-overlay">
                            <div className="user-info">
                                <div className="user-profile">
                                    <img
                                        src={prevSilhouette?.profile.avatarUrl || "/default-avatar.png"}
                                        alt={prevSilhouette?.profile.nickname}
                                        className="user-avatar"
                                    />
                                    <div className="user-details">
                                        <p className="user-nickname">@{prevSilhouette?.profile.nickname}</p>
                                    </div>
                                </div>
                                <div className="action-buttons">
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
                    </div>

                    {/* Current slide */}
                    <div className="slide slide-current">
                        <div className="silhouette-video-container">
                            {/* TEMPORARY - Index display for testing */}
                            <div className="slide-index">
                                {currentIndex}
                            </div>
                            {/* END TEMPORARY */}
                            {currentSilhouette.type === SilhouetteType.VIDEO ? (
                                <video
                                    src={currentSilhouette.contentUrl}
                                    className="silhouette-video"
                                    controls
                                    loop
                                    muted
                                    autoPlay
                                />
                            ) : (
                                <img
                                    src={currentSilhouette.contentUrl}
                                    alt={currentSilhouette.title}
                                    className="silhouette-image"
                                />
                            )}
                        </div>
                        {/* Current slide overlay */}
                        <div className="silhouette-overlay">
                            <div className="user-info">
                                <div className="user-profile">
                                    <img
                                        src={currentSilhouette.profile.avatarUrl || "/default-avatar.png"}
                                        alt={currentSilhouette.profile.nickname}
                                        className="user-avatar"
                                    />
                                    <div className="user-details">
                                        <p className="user-nickname">@{currentSilhouette.profile.nickname}</p>
                                    </div>
                                </div>
                                <div className="action-buttons">
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
                    </div>

                    {/* Next slide */}
                    <div className="slide slide-next">
                        <div className="silhouette-video-container">
                            {/* TEMPORARY - Index display for testing */}
                            <div className="slide-index">
                                {(currentIndex + 1) % silhouettes.length}
                            </div>
                            {/* END TEMPORARY */}
                            {nextSilhouette && nextSilhouette.type === SilhouetteType.VIDEO ? (
                                <video src={nextSilhouette.contentUrl} className="silhouette-video" muted />
                            ) : nextSilhouette ? (
                                <img
                                    src={nextSilhouette.contentUrl}
                                    alt={nextSilhouette.title}
                                    className="silhouette-image"
                                />
                            ) : null}
                        </div>
                        {/* Next slide overlay */}
                        <div className="silhouette-overlay">
                            <div className="user-info">
                                <div className="user-profile">
                                    <img
                                        src={nextSilhouette?.profile.avatarUrl || "/default-avatar.png"}
                                        alt={nextSilhouette?.profile.nickname}
                                        className="user-avatar"
                                    />
                                    <div className="user-details">
                                        <p className="user-nickname">@{nextSilhouette?.profile.nickname}</p>
                                    </div>
                                </div>
                                <div className="action-buttons">
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
                    </div>
                </div>

                {/* Progress Indicator */}
                <div className="progress-indicator">
                    {silhouettes.map((_, index) => (
                        <div
                            key={index}
                            className={`progress-dot ${index === currentIndex ? "active" : ""}`}
                            onClick={() => setCurrentIndex(index)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
