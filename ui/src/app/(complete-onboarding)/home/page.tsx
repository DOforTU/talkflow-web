"use client";

import { useState, useEffect } from "react";
import { useAuthLanguage } from "@/context/Language";
import { homeTexts } from "@/text/app/home";
import { eventApi } from "@/lib/api/event";
import {
    getSelectedDateEvents,
    calculateDistance,
    formatDistance,
    getEventsForDateIncludingMultiDay,
    sortEventsByTime,
} from "@/lib/utils/eventUtils";
import Calendar from "../../../components/home/Calendar";
import MapModal from "../../../components/home/MapModal";
import CreateEventModal from "../../../components/home/CreateEventModal";
import UpdateEventModal from "../../../components/home/UpdateEventModal";
import "./HomePage.css";
import { ResponseEventDto } from "@/lib/types/event.interface";

export default function HomePage() {
    const { currentLanguage } = useAuthLanguage();
    const [events, setEvents] = useState<ResponseEventDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [showMapModal, setShowMapModal] = useState(false);
    const [showCreateEventModal, setShowCreateEventModal] = useState(false);
    const [showUpdateEventModal, setShowUpdateEventModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<ResponseEventDto | null>(null);

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

    // 선택된 날짜의 이벤트 가져기기 (다중일 이벤트 포함)
    const filteredEvents = getEventsForDateIncludingMultiDay(events, selectedDate);
    const selectedDateEvents = sortEventsByTime(filteredEvents);

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

    // 이벤트 수정 후 목록 새로고침
    const handleEventUpdated = async () => {
        try {
            const fetchedEvents = await eventApi.getMyEvents();
            setEvents(fetchedEvents);
        } catch (error) {
            console.error("Failed to reload events:", error);
        }
    };

    // 일정 아이템 클릭 핸들러
    const handleEventClick = (event: ResponseEventDto) => {
        setSelectedEvent(event);
        setShowUpdateEventModal(true);
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
                                {selectedDateEvents.length > 0 ? (
                                    (() => {
                                        let timedEventIndex = 0;

                                        return selectedDateEvents.map((event, index) => {
                                            // 현재 이벤트가 시간 이벤트인 경우에만 번호 증가
                                            const currentEventNumber = event.isAllDay ? null : ++timedEventIndex;

                                            // 이전 location이 있는 이벤트 찾기 (현재 이벤트에 location이 있을 때만)
                                            let prevLocationEvent = null;
                                            let distance = null;

                                            if (event.location) {
                                                // 현재 이벤트보다 이전 이벤트 중에서 location이 있는 것 찾기
                                                for (let i = index - 1; i >= 0; i--) {
                                                    if (selectedDateEvents[i].location) {
                                                        prevLocationEvent = selectedDateEvents[i];
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
                                                    <div
                                                        className="schedule-item"
                                                        onClick={() => handleEventClick(event)}
                                                        style={{ cursor: "pointer" }}
                                                    >
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

            <UpdateEventModal
                isOpen={showUpdateEventModal}
                onClose={() => setShowUpdateEventModal(false)}
                onEventUpdated={handleEventUpdated}
                event={selectedEvent}
            />
        </div>
    );
}
