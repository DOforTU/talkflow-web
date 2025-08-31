"use client";

import { useState } from "react";
import { useAuthLanguage } from "@/context/Language";
import { homeTexts } from "@/text/app/home";
import { SupportedLanguage } from "@/lib/types/user.interface";
import { ResponseEvent } from "@/lib/types/event.interface";

interface CalendarProps {
    events: ResponseEvent[];
    onDateSelect: (date: Date) => void;
}

export default function Calendar({ events, onDateSelect }: CalendarProps) {
    const { currentLanguage } = useAuthLanguage();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    const texts = homeTexts[currentLanguage];

    // 캘린더 관련 함수들
    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const formatMonth = (date: Date) => {
        // 언어에 따라 다른 locale 사용
        const locale = currentLanguage === SupportedLanguage.EN ? "en-US" : "ko-KR";
        return date.toLocaleDateString(locale, { year: "numeric", month: "long" });
    };

    const isToday = (day: number) => {
        const today = new Date();
        return (
            today.getDate() === day &&
            today.getMonth() === currentDate.getMonth() &&
            today.getFullYear() === currentDate.getFullYear()
        );
    };

    const isSelected = (date: Date) => {
        return (
            selectedDate.getDate() === date.getDate() &&
            selectedDate.getMonth() === date.getMonth() &&
            selectedDate.getFullYear() === date.getFullYear()
        );
    };

    const goToPreviousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const goToNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    // 특정 날짜의 이벤트 가져오기
    const getEventsForDate = (date: Date) => {
        return events.filter((event) => {
            const eventDate = new Date(event.startTime);
            return (
                eventDate.getDate() === date.getDate() &&
                eventDate.getMonth() === date.getMonth() &&
                eventDate.getFullYear() === date.getFullYear()
            );
        });
    };

    const generateCalendarDays = () => {
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDay = getFirstDayOfMonth(currentDate);
        const days = [];

        // 이전 달의 날짜들
        const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1);
        const daysInPrevMonth = getDaysInMonth(prevMonth);
        for (let i = firstDay - 1; i >= 0; i--) {
            days.push({
                day: daysInPrevMonth - i,
                isCurrentMonth: false,
                date: new Date(prevMonth.getFullYear(), prevMonth.getMonth(), daysInPrevMonth - i),
            });
        }

        // 현재 달의 날짜들
        for (let day = 1; day <= daysInMonth; day++) {
            days.push({
                day,
                isCurrentMonth: true,
                date: new Date(currentDate.getFullYear(), currentDate.getMonth(), day),
            });
        }

        // 다음 달의 날짜들 (42개 채우기 위해)
        const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1);
        const remainingDays = 42 - days.length;
        for (let day = 1; day <= remainingDays; day++) {
            days.push({
                day,
                isCurrentMonth: false,
                date: new Date(nextMonth.getFullYear(), nextMonth.getMonth(), day),
            });
        }

        return days;
    };

    const calendarDays = generateCalendarDays();
    const dayNames = [
        texts.calendar.dayNames.sunday,
        texts.calendar.dayNames.monday,
        texts.calendar.dayNames.tuesday,
        texts.calendar.dayNames.wednesday,
        texts.calendar.dayNames.thursday,
        texts.calendar.dayNames.friday,
        texts.calendar.dayNames.saturday,
    ];

    return (
        <section className="calendar-section">
            <div className="calendar-header">
                <h2 className="calendar-title">{formatMonth(currentDate)}</h2>
                <div className="calendar-nav">
                    <button className="calendar-nav-btn" onClick={goToPreviousMonth}>
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                    </button>
                    <button className="calendar-nav-btn" onClick={goToNextMonth}>
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="calendar-grid">
                {/* 요일 헤더 */}
                {dayNames.map((day, index) => (
                    <div key={day} className={`calendar-day-header ${index === 0 ? "sunday" : ""}`}>
                        {day}
                    </div>
                ))}

                {/* 날짜 */}
                {calendarDays.map((dateInfo, index) => {
                    const dayOfWeek = index % 7; // 0=일요일, 1=월요일, ...
                    const dayEvents = getEventsForDate(dateInfo.date);
                    const hasEvents = dayEvents.length > 0;

                    return (
                        <div
                            key={index}
                            className={`calendar-day ${!dateInfo.isCurrentMonth ? "other-month" : ""} ${
                                dateInfo.isCurrentMonth && isToday(dateInfo.day) ? "today" : ""
                            } ${dayOfWeek === 0 ? "sunday" : ""} ${hasEvents ? "has-events" : ""} ${
                                dateInfo.isCurrentMonth && isSelected(dateInfo.date) ? "selected" : ""
                            }`}
                            onClick={() => {
                                if (dateInfo.isCurrentMonth) {
                                    setSelectedDate(dateInfo.date);
                                    onDateSelect(dateInfo.date);
                                }
                            }}
                        >
                            <div className="calendar-day-number">{dateInfo.day}</div>
                            {hasEvents && (
                                <div className="calendar-day-events">
                                    {dayEvents.slice(0, 3).map((event, eventIndex) => (
                                        <div
                                            key={eventIndex}
                                            className="calendar-event"
                                            style={{ backgroundColor: event.colorCode }}
                                            title={event.title}
                                        >
                                            {event.title.length > 10
                                                ? event.title.substring(0, 10) + "..."
                                                : event.title}
                                        </div>
                                    ))}
                                    {dayEvents.length > 3 && (
                                        <div className="calendar-event-more">+{dayEvents.length - 3}</div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}