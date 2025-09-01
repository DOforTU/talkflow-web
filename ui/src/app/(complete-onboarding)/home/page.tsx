"use client";

import { useState, useEffect } from "react";
import { useAuthLanguage } from "@/context/Language";
import { homeTexts } from "@/text/app/home";
import { ResponseEvent } from "@/lib/types/event.interface";
import { eventApi } from "@/lib/api/event";
import Calendar from "../../../components/home/Calendar";
import MapModal from "../../../components/home/MapModal";
import CreateEventModal from "../../../components/home/CreateEventModal";
import "./HomePage.css";

export default function HomePage() {
    const { currentLanguage } = useAuthLanguage();
    const [events, setEvents] = useState<ResponseEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [showMapModal, setShowMapModal] = useState(false);
    const [showCreateEventModal, setShowCreateEventModal] = useState(false);

    const texts = homeTexts[currentLanguage];

    // 이벤트 데이터 로드
    useEffect(() => {
        const loadEvents = async () => {
            try {
                setIsLoading(true);
                const fetchedEvents = await eventApi.getMyEvents();
                setEvents(fetchedEvents);
            } catch (error) {
                console.error("Failed to load events:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadEvents();
    }, []);

    // 선택된 날짜의 이벤트 가져기기
    const getSelectedDateEvents = () => {
        const selectedDateStr = selectedDate.toISOString().split("T")[0];

        const filteredEvents = events.filter((event) => {
            // "2025-09-01 19:30" -> "2025-09-01" 추출
            const eventDateStr = event.startTime.split(" ")[0];
            const matches = eventDateStr === selectedDateStr;

            return matches;
        });

        return filteredEvents.sort((a, b) => {
            // 하루종일 이벤트를 맨 위로, 나머지는 시간순
            if (a.isAllDay && !b.isAllDay) return -1;
            if (!a.isAllDay && b.isAllDay) return 1;
            return a.startTime.localeCompare(b.startTime);
        });
    };

    // 날짜 선택 핸들러
    const handleDateSelect = (date: Date) => {
        setSelectedDate(date);
    };

    // 이벤트 생성 후 목록 새로고침
    const handleEventCreated = async () => {
        try {
            const fetchedEvents = await eventApi.getMyEvents();
            setEvents(fetchedEvents);
        } catch (error) {
            console.error("Failed to reload events:", error);
        }
    };

    // 두 지점 간 직선 거리 계산 (Haversine formula)
    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
        const R = 6371000; // 지구 반지름 (미터)
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((lat1 * Math.PI) / 180) *
                Math.cos((lat2 * Math.PI) / 180) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // 미터 단위
    };

    // 거리를 적절한 단위로 포맷
    const formatDistance = (distance: number): string => {
        if (distance >= 1000) {
            return `${(distance / 1000).toFixed(1)}km`;
        } else {
            return `${Math.round(distance)}m`;
        }
    };

    return (
        <div className="home-page">
            {/* Main Content */}
            <main className="home-main">
                {/* Calendar Section */}
                <Calendar events={events} onDateSelect={handleDateSelect} />

                {/* Selected Day Schedule */}
                <section className="select-day-schedule">
                    <div className="schedule-header">
                        <h2 className="select-day-schedule-title">
                            {selectedDate.toLocaleDateString(currentLanguage === "en" ? "en-US" : "ko-KR", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </h2>
                        <div className="schedule-header-buttons">
                            <button
                                className="create-event-btn"
                                onClick={() => setShowCreateEventModal(true)}
                                aria-label="일정 생성"
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <line x1="12" y1="5" x2="12" y2="19" />
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                </svg>
                            </button>
                            <button
                                className="map-view-btn"
                                onClick={() => setShowMapModal(true)}
                                aria-label="지도 보기"
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                    <circle cx="12" cy="10" r="3" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div className="schedule-list">
                        {isLoading ? (
                            <div className="schedule-loading">Loading...</div>
                        ) : (
                            <>
                                {getSelectedDateEvents().length > 0 ? (
                                    (() => {
                                        let timedEventIndex = 0;
                                        const events = getSelectedDateEvents();

                                        return events.map((event, index) => {
                                            // 현재 이벤트가 시간 이벤트인 경우에만 번호 증가
                                            const currentEventNumber = event.isAllDay ? null : ++timedEventIndex;

                                            // 이전 location이 있는 이벤트 찾기 (현재 이벤트에 location이 있을 때만)
                                            let prevLocationEvent = null;
                                            let distance = null;

                                            if (event.location) {
                                                // 현재 이벤트보다 이전 이벤트 중에서 location이 있는 것 찾기
                                                for (let i = index - 1; i >= 0; i--) {
                                                    if (events[i].location) {
                                                        prevLocationEvent = events[i];
                                                        distance = calculateDistance(
                                                            prevLocationEvent.location!.latitude,
                                                            prevLocationEvent.location!.longitude,
                                                            event.location.latitude,
                                                            event.location.longitude
                                                        );
                                                        break;
                                                    }
                                                }
                                            }

                                            return (
                                                <div key={event.id}>
                                                    {/* 거리 표시 - 현재 이벤트 위에 표시 */}
                                                    {distance && (
                                                        <div className="schedule-distance">
                                                            <div className="distance-line"></div>
                                                            <div className="distance-text">
                                                                {formatDistance(distance)}
                                                            </div>
                                                        </div>
                                                    )}
                                                    <div className="schedule-item">
                                                        <div
                                                            className="schedule-color-dot"
                                                            style={{ backgroundColor: event.colorCode }}
                                                        >
                                                            {currentEventNumber || ""}
                                                        </div>
                                                        <div className="schedule-time">
                                                            {event.isAllDay ? (
                                                                texts.schedule.allDay
                                                            ) : (
                                                                <>
                                                                    <div>{event.startTime.split(" ")[1]}</div>
                                                                    <div>{event.endTime.split(" ")[1]}</div>
                                                                </>
                                                            )}
                                                        </div>
                                                        <div className="schedule-content">
                                                            <div className="schedule-title">{event.title}</div>
                                                            {event.description && (
                                                                <div className="schedule-description">
                                                                    {event.description}
                                                                </div>
                                                            )}
                                                            {event.location && (
                                                                <div className="schedule-location">
                                                                    📍 {event.location.nameKo || event.location.nameEn}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        });
                                    })()
                                ) : (
                                    <div className="no-schedule">
                                        {selectedDate.toDateString() === new Date().toDateString()
                                            ? texts.schedule.noSchedule
                                            : texts.schedule.noScheduleForDate.replace(
                                                  "{day}",
                                                  selectedDate.getDate().toString()
                                              )}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </section>
                {/* Voice Recording Button */}
                <button
                    className="voice-record-btn"
                    onClick={() => alert(texts.voice.recordingReady)}
                    aria-label={texts.voice.ariaLabel}
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
                        <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
                        <line x1="12" y1="19" x2="12" y2="23" />
                        <line x1="8" y1="23" x2="16" y2="23" />
                    </svg>
                </button>
            </main>

            <MapModal
                isOpen={showMapModal}
                onClose={() => setShowMapModal(false)}
                events={events}
                selectedDate={selectedDate}
            />

            <CreateEventModal
                isOpen={showCreateEventModal}
                onClose={() => setShowCreateEventModal(false)}
                onEventCreated={handleEventCreated}
                selectedDate={selectedDate}
            />
        </div>
    );
}
