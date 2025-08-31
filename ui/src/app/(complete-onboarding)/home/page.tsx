"use client";

import { useState, useEffect } from "react";
import { useAuthLanguage } from "@/context/Language";
import { homeTexts } from "@/text/app/home";
import { ResponseEvent } from "@/lib/types/event.interface";
import { eventApi } from "@/lib/api/event";
import Calendar from "../../../components/home/Calendar";
import "./HomePage.css";

export default function HomePage() {
    const { currentLanguage } = useAuthLanguage();
    const [events, setEvents] = useState<ResponseEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

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

    // 선택된 날짜의 이벤트 가져오기
    const getSelectedDateEvents = () => {
        return events
            .filter((event) => {
                const eventDate = new Date(event.startTime);
                return (
                    eventDate.getDate() === selectedDate.getDate() &&
                    eventDate.getMonth() === selectedDate.getMonth() &&
                    eventDate.getFullYear() === selectedDate.getFullYear()
                );
            })
            .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    };

    // 날짜 선택 핸들러
    const handleDateSelect = (date: Date) => {
        setSelectedDate(date);
    };

    return (
        <div className="home-page">
            {/* Main Content */}
            <main className="home-main">
                {/* Calendar Section */}
                <Calendar events={events} onDateSelect={handleDateSelect} />

                {/* Selected Day Schedule */}
                <section className="select-day-schedule">
                    <h2 className="select-day-schedule-title">
                        {selectedDate.toLocaleDateString(currentLanguage === "en" ? "en-US" : "ko-KR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </h2>
                    <div className="schedule-list">
                        {isLoading ? (
                            <div className="schedule-loading">Loading...</div>
                        ) : (
                            <>
                                {getSelectedDateEvents().length > 0 ? (
                                    getSelectedDateEvents().map((event) => (
                                        <div key={event.id} className="schedule-item">
                                            <div className="schedule-time">
                                                {new Date(event.startTime).toLocaleTimeString("ko-KR", {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    hour12: false,
                                                })}
                                            </div>
                                            <div className="schedule-content">
                                                <div className="schedule-title">{event.title}</div>
                                                {event.description && (
                                                    <div className="schedule-description">{event.description}</div>
                                                )}
                                                {event.location && (
                                                    <div className="schedule-location">
                                                        📍 {event.location.nameKo || event.location.nameEn}
                                                    </div>
                                                )}
                                            </div>
                                            <div
                                                className="schedule-color"
                                                style={{ backgroundColor: event.colorCode }}
                                            ></div>
                                        </div>
                                    ))
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
        </div>
    );
}
